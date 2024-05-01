import express from 'express';
import urlRouter from './routes/UrlRouter.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const app = express();
const PORT = 3000 || process.env.PORT;
dotenv.config();
app.use(express.json());
app.use(urlRouter);
mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/url-shortener');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map