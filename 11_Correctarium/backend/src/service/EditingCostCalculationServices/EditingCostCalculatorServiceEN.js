import { calculateCostOfEditing } from "./SharedCostCalculatorService.js";

const costConfiguration = {
    PRICE_OF_SYMBOL_EN: 0.12,
    START_PRICE_EN: 120,
    MULTIPLIER_FOR_OTHER_TYPE: 1.2
};

const calculateCostOfEditingEN = (mimetype, amountOfSymbols) => {
    return calculateCostOfEditing({
        mimetype,
        amountOfSymbols,
        startPrice: costConfiguration.START_PRICE_EN,
        priceForSymbol: costConfiguration.PRICE_OF_SYMBOL_EN,
        multiplier: costConfiguration.MULTIPLIER_FOR_OTHER_TYPE
    });
};

export { calculateCostOfEditingEN };
