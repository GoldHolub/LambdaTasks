import fs from 'fs';

const FILE_PATH = 'original-vacation-info.json';
const NEW_FILE_PATH = 'new-vacation-info.json';

const readFile = (filePath) => {
    const vacationFile = fs.readFileSync(filePath);
    const vacationInfo = JSON.parse(vacationFile);
    return vacationInfo;
}

const groupVacationInfo = (vacationInfo) => {
    let newVacationInfo = new Map();
    vacationInfo.forEach(element => {
        const userId = element.user._id;
        const weekendDates = { startDate: element.startDate, endDate: element.endDate };
        if (newVacationInfo.has(userId)) {
            newVacationInfo.get(userId).weekendDates.push(weekendDates);
        } else {
            const userName = element.user.name;
            newVacationInfo.set(userId, { userId, userName, weekendDates: [weekendDates] });
        }
    });
    return Array.from(newVacationInfo.values());
}

const createNewVacationFile = (newVacationInfo) => {
    fs.writeFileSync(NEW_FILE_PATH, JSON.stringify(newVacationInfo)); 
}

const vacationInfo = readFile(FILE_PATH);
const newVacationInfo = (groupVacationInfo(vacationInfo));
createNewVacationFile(newVacationInfo);