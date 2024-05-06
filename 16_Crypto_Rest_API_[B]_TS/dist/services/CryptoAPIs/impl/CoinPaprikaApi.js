import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
const COIN_STATS_ENDPOINT = 'https://api.coinpaprika.com/v1/tickers';
const MARKET_NAME = 'CoinPaprika';
export class CoinPaprikaApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(COIN_STATS_ENDPOINT);
            return response.data.slice(0, 30);
        }
        catch (error) {
            console.log('ups! ' + error);
        }
    }
    async mapToObj(cryptoResponse) {
        const cryptoData = cryptoResponse.map((crypto) => {
            const newCryptoData = new CoinMarketData();
            newCryptoData.market_name = MARKET_NAME;
            newCryptoData.name = crypto.symbol;
            newCryptoData.price = crypto.quotes.USD.price.toFixed(2);
            newCryptoData.saved_at = new Date();
            return newCryptoData;
        });
        return cryptoData;
    }
}
//# sourceMappingURL=CoinPaprikaApi.js.map