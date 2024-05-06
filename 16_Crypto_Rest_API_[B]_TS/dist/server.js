import express from 'express';
import bodyParser from 'body-parser';
import { CryptoApiService } from './services/CryptoApiService.js';
import crone from 'node-cron';
import router from './routes/CurrencyRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(router);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
crone.schedule('*/5 * * * *', async () => {
    await CryptoApiService.updateDbWithCryptoData();
});
//# sourceMappingURL=server.js.map