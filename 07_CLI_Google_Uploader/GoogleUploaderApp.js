import axios from "axios";
import fs from "fs";
import path from 'path';
import inquirer from 'inquirer';
import { google } from 'googleapis';

import credentials from 'file:///C:/Users/m98/Downloads/myCredentials.json' assert { type: "json" };
const TOKEN_PATH = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const UNSAVE_TINY_TOKEN = '9x8LvDLSOEBhKVchM3RKM5zLqroCVi0P9yUpN6L0NoSnJDjFyVwGE8bYNSOn';
let drive;
main().catch(console.error);

async function main() {
    let oAuth2Client = await generateOAuthClient(credentials, SCOPES);
    drive = google.drive({ version: 'v3', auth: oAuth2Client });

    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'filePath',
                message: 'Enter the path to the image file:',
            },
            {
                type: 'input',
                name: 'folderName',
                message: 'Enter the name of the folder in Google Drive:',
            },
        ]);
        
        const folderId = await getOrCreateFolderId(answers.folderName);
        const fileName = await userInputForFileName(answers.filePath);
        const fileData = await uploadFile(answers.filePath, folderId, fileName);

        const userUrlType = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isShorten',
                message: 'Do you want to shorten URL?',
                default: false,
            },
        ]);

        userUrlType.isShorten 
            ? console.log('Your short link: ', await shortenURL(fileData.webViewLink, UNSAVE_TINY_TOKEN))
            : console.log('Your URL: ', fileData.webViewLink);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function generateOAuthClient(credentials, scopes) {
    let oAuth2Client;
    try {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        google.options({ auth: oAuth2Client });
        const tokenFile = fs.readFileSync(TOKEN_PATH);

        if (tokenFile !== undefined && tokenFile.length !== 0) {
            console.log('Token already exists and is not empty %s', tokenFile)
            oAuth2Client.setCredentials(JSON.parse(tokenFile))
        } else {
            console.log('Token is empty!🤬🤬🤬!');
            throw new Error('Empty token');
        }

        return Promise.resolve(oAuth2Client)
    } catch (err) {
        console.log('Token not found or empty, generating a new one!');
        oAuth2Client = await getAccessToken(oAuth2Client, scopes);

        return Promise.resolve(oAuth2Client)
    }
}

async function getAccessToken(oAuth2Client, scopes) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'code',
            message: 'Enter the code from that page here:',
        }
    ]);
    console.log(`🤝 Ok, your access_code is ${answer['code']}`);
    const response = await oAuth2Client.getToken(answer['code']);
    console.log('Token received from Google %j', response.tokens);
    oAuth2Client.setCredentials(response.tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(response.tokens));

    return Promise.resolve(oAuth2Client)
}

async function uploadFile(filePath, folderId, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };
        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(filePath),
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink',
        });
        console.log('File successfully uploaded!');
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

async function getOrCreateFolderId(folderName) {
    const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: 'files(id)',
    });

    if (response.data.files.length > 0) {
        return response.data.files[0].id;
    } else {
        const folderMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
        };
        const newFolder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id',
        });
        return newFolder.data.id;
    }
}

async function shortenURL(url, token) {
    try {
        const response = await axios.post('https://api.tinyurl.com/create', { url }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data.tiny_url;
    } catch (error) {
        console.error('Error shortening URL:', error.message);
        throw error;
    }
}

async function userInputForFileName(filePath) {
    let fileName = path.basename(filePath);
    try {
        const userAnswers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'rename',
                message: 'Do you want to rename the image before uploading?',
                default: false,
            },
            {
                type: 'input',
                name: 'newFileName',
                message: 'Enter the new file name:',
                when: (answers) => answers.rename,
            }
        ]);

        if (userAnswers.rename) {
            fileName = userAnswers.newFileName.trim();
        }
    } catch (error) {
        console.error('Error to name file:', error.message);
        throw error;
    }

    return fileName;
}
