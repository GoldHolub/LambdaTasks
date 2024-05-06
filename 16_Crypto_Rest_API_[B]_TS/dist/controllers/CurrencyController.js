import { CryptoApiService } from "../services/CryptoApiService.js";
export class CurrencyController {
    static async getCryptoDataInRange(req, res) {
        try {
            const { cryptocurrency, market, period } = req.body;
            if (!cryptocurrency || !period) {
                res.status(400).json({ error: 'Cryptocurrency and period are required parameters.' });
                return;
            }
            const periodOfTime = Number.parseFloat(period) * 60 * 60 * 1000;
            let cryptoData;
            if (market) {
                cryptoData = await CryptoApiService.getCryptoInRangeForMarket(cryptocurrency.toString(), periodOfTime, market);
            }
            else {
                cryptoData = await CryptoApiService.getCryptoWithAveragePriceInRange(cryptocurrency.toString(), periodOfTime);
            }
            res.json(cryptoData);
        }
        catch (error) {
            res.status(500).json({ error: `Internal server errorS - ${error}` });
        }
    }
    static async getCryptoDataList(req, res) {
        try {
            const cryptoData = await CryptoApiService.getListOfHypedCryptocurrencies();
            res.json(cryptoData);
        }
        catch (error) {
            res.status(500).json({ error: `Internal server errorD - ${error}` });
        }
    }
}
//# sourceMappingURL=CurrencyController.js.map