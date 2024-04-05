import { calculateCostOfEditing } from "../../service/EditingCostCalculationServices/SharedCostCalculatorService";

describe('calculateCostOfEditing Tests', () => {
    test('test_calculateCostOfEditing_basicCheck', () => {
        const params = {
            mimetype: 'text',
            amountOfSymbols: 1000,
            startPrice: 50,
            priceForSymbol: 0.1,
            multiplier: 1.5
        };
        expect(calculateCostOfEditing(params)).toBe(100);
    });

    test('test_calculateCostOfEditing_check_multiplier', () => {
        const params = {
            mimetype: 'other',
            amountOfSymbols: 1000,
            startPrice: 50,
            priceForSymbol: 0.05,
            multiplier: 1.5
        };
        expect(calculateCostOfEditing(params)).toBe(75);
    });

    test('test_calculateCostOfEditing_check_startPrice', () => {
        const params = {
            mimetype: 'text',
            amountOfSymbols: 100,
            startPrice: 50,
            priceForSymbol: 0.01,
            multiplier: 1.5
        };
        expect(calculateCostOfEditing(params)).toBe(50);
    });
});