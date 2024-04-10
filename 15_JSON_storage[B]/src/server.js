import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import storageRouter from './routes/jsonStorageRoutes.js';

const app = express();
const PORT = process.env.PORt || 3000;

mongoose.connect('mongodb://localhost:27017/my_JSON_storage');

app.use(bodyParser.json());
app.use('/', storageRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;