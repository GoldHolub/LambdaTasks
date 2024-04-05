import express from 'express';
import bodyParser from 'body-parser';
import editingRoutes from './routes/editingRoutes.js'

const app = express();

app.use(bodyParser.json());

app.use('/api', editingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;
