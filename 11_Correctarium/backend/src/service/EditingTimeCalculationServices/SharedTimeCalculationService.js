export default class TimeCalculator {
    constructor(startTime, symbolsPerHour, minTime) {
        this.startTime = startTime;
        this.symbolsPerHour = symbolsPerHour;
        this.minTime = minTime;
    }

    calculateEditingTime(mimetype, amountOfSymbols) {
        let editingTime = this.startTime + amountOfSymbols / this.symbolsPerHour;
        if (mimetype === 'other') {
            editingTime *= 1.2;
        }
        editingTime = Math.max(editingTime, this.minTime);
        return Math.ceil(editingTime);
    }
}