import { countEditingTimeEN } from "./EditingTimeCalculationServices/EditingTimeCalculationServiceEN.js";
import { countEditingTimeUA } from "./EditingTimeCalculationServices/EditingTimeCalculationServiceUA.js";

const WORKING_START_HOUR = 10;
const WORKING_END_HOUR = 19;

const languageFunctions = {
    'en': countEditingTimeEN,
    'ua': countEditingTimeUA
};

const countDeadline = (language, mimetype, amountOfSymbols) => {
    let editingTime;
    if (language in languageFunctions) {
        editingTime = languageFunctions[language](mimetype, amountOfSymbols);
    } else {
        throw new Error('Unsupported language');
    }

    const currentTimestamp = Math.ceil(Date.now() / 1000);
    const currentHour = new Date(currentTimestamp * 1000).getHours();
    let remainingHours = editingTime;

    let deadlineTimestamp = currentTimestamp;
    let deadlineHour = currentHour;

    while (remainingHours > 0) {
        deadlineTimestamp += 3600;
        deadlineHour = (deadlineHour + 1) % 24;

        if (deadlineHour >= WORKING_START_HOUR && deadlineHour < WORKING_END_HOUR) {
            remainingHours--;
        }
    }

    const formattedDeadlineDate = new Date(deadlineTimestamp * 1000).toLocaleString();


    return { editingTime, deadlineTimestamp, formattedDeadlineDate }
}
export { countDeadline }