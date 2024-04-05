import editingController from "../../controllers/EditingController.js";

describe('Editing Controller', () => {
    it('should return a valid editing bill', () => {
        const req = { body: { language: 'en', mimetype: 'doc', amountOfSymbols: 10000 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        editingController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            price: expect.any(Number),
            time: expect.any(Number),
            deadline: expect.any(Number),
            deadline_date: expect.any(String)
        }));
    });
});