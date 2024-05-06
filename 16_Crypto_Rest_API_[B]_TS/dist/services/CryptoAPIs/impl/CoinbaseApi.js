import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
const COIN_BASE_ENDPOINT = 'https://api.coinbase.com/v2/currencies/crypto';
const CRYPTOCURRENCY_LIMIT = 30;
const MARKET_NAME = 'CoinBase';
export class CoinbaseApi {
    async getLatestCryptoData() {
        try {
            const cryptoArray = [];
            const response = await axios.get(COIN_BASE_ENDPOINT);
            for (let i = 0; i < CRYPTOCURRENCY_LIMIT; i++) {
                const cryptoCode = response.data.data[i].code;
                const currencyPricesResponse = await axios.get(`https://api.coinbase.com/v2/prices/${cryptoCode}-USD/buy`);
                cryptoArray.push(currencyPricesResponse.data.data);
            }
            return cryptoArray;
        }
        catch (error) {
            console.log('ups!');
        }
    }
    async mapToObj(cryptoArray) {
        const marketData = cryptoArray.map((crypto) => {
            const coinMarketData = new CoinMarketData();
            coinMarketData.market_name = MARKET_NAME;
            coinMarketData.name = crypto.base;
            coinMarketData.price = crypto.amount;
            coinMarketData.saved_at = new Date();
            return coinMarketData;
        });
        return marketData;
    }
}
//# sourceMappingURL=CoinbaseApi.js.map