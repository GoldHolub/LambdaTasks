const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function startApp() {
    readline.question('put some words separated by spaces: ', inputString => {
        const {words, numbers} = processInputByGroups(inputString);
        processOperationByOptions(words, numbers, inputString);
    });
}

function processOperationByOptions(words, numbers, inputString) {
    displayOption(); 
    readline.question('Choose an operation (1-6): ', option => {
        switch(option) {
            case "1": 
                console.info(sortWordsAlphabetically(words));
                break;
            case "2": 
                console.info(sortNumbersAscending(numbers)); 
                break;
            case "3": 
                console.info(sortNumbersDescending(numbers));
                break;
            case "4": 
                console.info(sortWordsByLength(words));
                break;
            case "5": 
                console.info(sortUniqueValues(words));
                break;
            case "6": 
                console.info(sortUniqueValues(inputString.split(" "))); 
                break;           
            case "exit" : 
                console.info("Bye, the program has been closed.")
                readline.close();
                return; 
            default: 
                console.info("Invalid option!!");      
        }
        processOperationByOptions(words, numbers, inputString);
    });
}

function displayOption() {
    console.info("\n1. Words by name."
                + "\n2. Show digits by ASC."
                + "\n3. Show digits by DCSC."
                + "\n4. Sort words by quantity of letters."
                + "\n5. Show unique words."
                + "\n6. Show only the unique values(words + numbers + symbols)");0
}

function processInputByGroups(input) {
    const inputValues = input.split(" ");
    const words = inputValues.filter(inputValues => isNaN(inputValues));
    const numbers = inputValues.filter(inputValues => !isNaN(inputValues)).map(Number);
    return {words, numbers};
}

function sortWordsAlphabetically(words) {
    return words.sort();
}

function sortNumbersAscending(numbers) {
    return numbers.sort((a, b) => a - b);
}

function sortNumbersDescending(numbers) {
    return numbers.sort((a, b) => b - a);
}

function sortWordsByLength(words) {
    return words.sort((a, b) => a.length - b.length);
}

function sortUniqueValues(inputValues) {
    return Array.from(new Set(inputValues));
}

startApp();
