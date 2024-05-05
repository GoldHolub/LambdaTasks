import fs from 'fs';
import path from 'path';

const FOLDER_PATH = 'files';
const AMOUNT_OF_FILES = 10;
let amountOfAllFiles;

const readWordsFromFilesInFolder = (folderPath) => {
    const words = [];
    try {
        const files = fs.readdirSync(folderPath);
        amountOfAllFiles = files.length;
        files.forEach((file) => {
            if (path.extname(file).toLowerCase() === '.txt') {
                const filePath = path.join(folderPath, file);
                const fileContents = fs.readFileSync(filePath, 'utf-8');
                words.push(fileContents.split('\n'));
            }
        });
    } catch (err) {
        console.error('Error reading folder:', err);
    }
    return words;
};

const createUsernamesMap = (wordsByFile) => {
    const usernamesMap = new Map();
    wordsByFile.forEach((words) => {
        const uniqueWords = new Set(words);
        uniqueWords.forEach((word) => {
            const count = usernamesMap.get(word) || 0;
            usernamesMap.set(word, count + 1);
        });
    });
    return usernamesMap;
}


const findTotalAmountOfUniqueNames = (usernamesMap) => {
    return usernamesMap.size;
}

const amountOFUsernamesInAllFiles = (usernamesMap, filesAmount) => {
    return Array.from(usernamesMap.values())
                .filter(count => count == filesAmount)
                .length;
}

const amountOFUsernamesInMoreThanTenFiles = (usernamesMap, filesAmount) => {
    return Array.from(usernamesMap.values())
                .filter(count => count >= filesAmount)
                .length;
}

const words = readWordsFromFilesInFolder(FOLDER_PATH);
const usernamesMap = createUsernamesMap(words);

const totalUniqueUsernames = findTotalAmountOfUniqueNames(usernamesMap);
const usernamesInAllFiles = amountOFUsernamesInAllFiles(usernamesMap, amountOfAllFiles);
const usernamesInAtLeast10Files = amountOFUsernamesInMoreThanTenFiles(usernamesMap, AMOUNT_OF_FILES);

console.log("Total unique usernames:", totalUniqueUsernames); // Unique phrases: 129240
console.log("Usernames appearing in all files:", usernamesInAllFiles); // Phrases present in all 20 files: 441
console.log("Usernames appearing in at least 10 files:", usernamesInAtLeast10Files); //Phrases present in at least ten files: 73245
