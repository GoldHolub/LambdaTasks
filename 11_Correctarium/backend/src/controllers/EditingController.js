import { createEditingBill } from "../service/EditingBillService.js";

const editingController = (req, res) => {
    const { language, mimetype, amountOfSymbols } = req.body;

    if (!language || !mimetype || !amountOfSymbols) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const editingBill = createEditingBill(language, mimetype, amountOfSymbols);
        res.status(200).json(editingBill);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export default editingController;