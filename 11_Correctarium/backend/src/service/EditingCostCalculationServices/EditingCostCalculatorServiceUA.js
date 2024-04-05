import { calculateCostOfEditing } from "./SharedCostCalculatorService.js";

const costConfiguration = {
    PRICE_OF_SYMBOL_UA: 0.05,
    START_PRICE_UA: 50,
    MULTIPLIER_FOR_OTHER_TYPE: 1.2
};


const calculateCostOfEditingUA = (mimetype, amountOfSymbols) => {
    return calculateCostOfEditing({
        mimetype,
        amountOfSymbols,
        startPrice: costConfiguration.START_PRICE_UA,
        priceForSymbol: costConfiguration.PRICE_OF_SYMBOL_UA,
        multiplier: costConfiguration.MULTIPLIER_FOR_OTHER_TYPE
    });
};

export { calculateCostOfEditingUA };
