import express from 'express';
import authRouter from './routes/AuthRoutes.js';
import registrationRouter from './routes/RegistrationRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRouter);
app.use('/registration', registrationRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;