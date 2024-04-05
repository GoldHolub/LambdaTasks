import TimeCalculator from "../../service/EditingTimeCalculationServices/SharedTimeCalculationService";

describe('TimeCalculator', () => {
    test('calculateEditingTime should return the correct editing time for given mimetype and amount of symbols', () => {
        const calculator = new TimeCalculator(1, 100, 1);
        expect(calculator.calculateEditingTime('text', 200)).toBe(3);
    });

    test('calculateEditingTime should return the minimum time if the calculated editing time is less than the minimum time', () => {
        const calculator = new TimeCalculator(0, 100, 5);
        expect(calculator.calculateEditingTime('text', 100)).toBe(5);
    });

    test('calculateEditingTime should return the editing time multiplied by 1.2 if the mimetype is "other"', () => {
        const calculator = new TimeCalculator(0, 100, 1); 
        expect(calculator.calculateEditingTime('other', 200)).toBe(Math.ceil((2 * 1.2))); 
    });
});