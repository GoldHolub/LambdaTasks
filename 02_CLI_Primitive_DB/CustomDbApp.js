import fs from "fs";
import inquirer from 'inquirer';

const dbFilePath = "02_CLI_Primitive_DB/users.json";

function createFile() {
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, "[]");
    }
}

async function addUserToFile() {
    while (true) {
        const {userName} = await inquirer.prompt([
            {
                type: "input",
                name: "userName",
                message: "Enter user name (press ENTER to cancel): ",
            },
        ]);

        if (!userName.trim()) {
            break;
        }

        const {gender, age} = await inquirer.prompt([
            {
                type: "list",
                name: "gender",
                message: "select gender",
                choices: ["Male", "Female", "Other"], 
            },
            {
                type: "number",
                name: "age",
                message: "Enter age:",
            },
        ]);

        const userDetails = {
            userName,
            gender,
            age
        };

        updateDataInFile(userDetails);
    }
}

function updateDataInFile(data) {
    const existingData = JSON.parse(fs.readFileSync(dbFilePath));
    existingData.push(data);
    fs.writeFileSync(dbFilePath, JSON.stringify(existingData, null, 2));
}

async function startApp() {
    createFile();
    console.log("Welcome to the user database CLI app");
    await addUserToFile();

    const searchAnswer = await inquirer.prompt([
        {
            type: "confirm",
            name: "search",
            message: 'Do you want to search for a user?',
            default: false,
        },
    ]); 

    if (searchAnswer.search) {
        const userData = JSON.parse(fs.readFileSync(dbFilePath));
        console.log(userData);

        const { searchQuery } = await inquirer.prompt([
            {
                type: "input",
                name: "searchQuery",
                message: "Enter the user name or part of the user name to search:",
            },
        ]);

        const matchingUsers = findUsersByName(searchQuery);
        matchingUsers.length == 0 ? console.log(`User ${searchQuery} not found`) 
                                  : console.log("Matching users:", matchingUsers);
    }
}

function levenshteinDistance(checkedString, query) {
    const len1 = checkedString.length;
    const len2 = query.length;

    const matrix = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = checkedString[i - 1] === query[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,  
                matrix[i][j - 1] + 1,  
                matrix[i - 1][j - 1] + cost  
            );
        }
    }

    return matrix[len1][len2];
}

function findUsersByName(userNameQuery) {
    const userData = JSON.parse(fs.readFileSync(dbFilePath));
    const threshold = 1;

    const machingUsers = userData.filter(user => {
        const userName = user.userName.toLowerCase();
        const query = userNameQuery.toLowerCase();

        const distance = levenshteinDistance(userName, query);
        return distance <= threshold || userName.includes(query);
    })

    return machingUsers;
}

startApp();