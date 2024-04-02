import express from 'express';
import { locationController } from './controller/LocationController.mjs';

const app = express();

app.use(express.json());

app.get('/location', locationController.getLocation);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});