import { calculateCostOfEditingUA } from "./EditingCostCalculationServices/EditingCostCalculatorServiceUA.js";
import { calculateCostOfEditingEN } from "./EditingCostCalculationServices/EditingCostCalculatorServiceEN.js"

/**
 * Factory function to create a cost calculation service for a specific language.
 * @param {string} language - The language for which the service is created ('en' for English, 'ua' for Ukrainian).
 * @returns {Object} A cost calculation service object with a method to calculate the cost of translation.
 */

const createCostCalculationService = (language) => {
    const calculateCostOfEditingFunctions = {
        en: calculateCostOfEditingEN,
        ua: calculateCostOfEditingUA
    };

    const calculateCostOfEditing = (mimetype, amountOfSymbols) => {
        const calculationFunction = calculateCostOfEditingFunctions[language];
        if (!calculationFunction) {
            throw new Error('Unsupported language');
        }
        return calculationFunction(mimetype, amountOfSymbols);
    };

    return { calculateCostOfEditing };
};

export { createCostCalculationService };