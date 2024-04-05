import TimeCalculator from "./SharedTimeCalculationService.js";

const START_EDITING_TIME = 0.5;
const MIN_EDITING_TIME = 1;
const SYMBOLS_PER_HOUR = 333;

const countEditingTimeEN = (mimetype, amountOfSymbols) => {
    const editingTimeCalculator = new TimeCalculator(START_EDITING_TIME, SYMBOLS_PER_HOUR, MIN_EDITING_TIME);
    return editingTimeCalculator.calculateEditingTime(mimetype, amountOfSymbols);
}

export { countEditingTimeEN }