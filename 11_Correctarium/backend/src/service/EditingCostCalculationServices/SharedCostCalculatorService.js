const calculateCostOfEditing = ({
    mimetype, 
    amountOfSymbols, 
    startPrice, 
    priceForSymbol, 
    multiplier
}) => {
    let translationCost = amountOfSymbols * priceForSymbol;

    if (mimetype == 'other') {
        translationCost *= multiplier;
    }

    translationCost = Math.max(translationCost, startPrice);
    return +translationCost.toFixed(2);
};

export { calculateCostOfEditing };
