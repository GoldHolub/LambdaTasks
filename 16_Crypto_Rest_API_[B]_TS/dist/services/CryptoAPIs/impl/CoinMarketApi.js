import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
const COIN_MARKET_ENDPOINT = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const API_KEY = '64aa3cf6-5264-4dc3-9a1e-2e43c786c063';
const MARKET_NAME = 'CoinMarketCap';
const CRYPTOCURRENCY_LIMIT = 30;
export class CoinMarketApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(COIN_MARKET_ENDPOINT, {
                params: {
                    limit: CRYPTOCURRENCY_LIMIT,
                },
                headers: {
                    'X-CMC_PRO_API_KEY': API_KEY
                }
            });
            return response;
        }
        catch (error) {
            console.error('Error fetching cryptocurrency data from CoinMarketCap:', error);
            throw error;
        }
    }
    async mapToObj(cryptoResponse) {
        const cryptoData = cryptoResponse.data.data.map((crypto) => {
            const newCryptoData = new CoinMarketData();
            newCryptoData.market_name = MARKET_NAME;
            newCryptoData.name = crypto.symbol;
            newCryptoData.price = crypto.quote.USD.price.toFixed(2);
            newCryptoData.saved_at = new Date();
            return newCryptoData;
        });
        return cryptoData;
    }
}
//# sourceMappingURL=CoinMarketApi.js.map