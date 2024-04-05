import { countDeadline } from "./DeadlineCalculatorService.js"
import { createCostCalculationService } from "./CostCalculationService.js"

const createEditingBill = (language, mimetype, amountOfSymbols) => {
    const costCalculationService = createCostCalculationService(language);
    const price = costCalculationService.calculateCostOfEditing(mimetype, amountOfSymbols);
    const { editingTime, deadlineTimestamp, formattedDeadlineDate } = countDeadline(language, mimetype, amountOfSymbols);

    return {
        price: price,
        time: editingTime,
        deadline: deadlineTimestamp,
        deadline_date: formattedDeadlineDate
    };
};

export { createEditingBill }