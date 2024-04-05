import request from 'supertest';
import app from '../../CorrectariumApp.js';

describe('Editing Routes', () => {
    it('should calculate editing bill for a valid request', async () => {
        const res = await request(app)
            .post('/api/editing')
            .send({ language: 'en', mimetype: 'doc', amountOfSymbols: 10000 });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            price: expect.any(Number),
            time: expect.any(Number),
            deadline: expect.any(Number),
            deadline_date: expect.any(String)
        }));
    });
});