import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
const CRYPTOCURRENCY_LIMIT = 30;
const COIN_STATS_ENDPOINT = `https://openapiv1.coinstats.app/coins?limit=${CRYPTOCURRENCY_LIMIT}`;
const API_KEY = 'GbHbes7hU/Bx9iYaJNXfIsHhpBwujCxJcVNXtjT5P+w=';
const MARKET_NAME = 'CoinStats';
export class CoinStatsApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(COIN_STATS_ENDPOINT, {
                headers: {
                    'X-API-KEY': API_KEY
                }
            });
            return response;
        }
        catch (error) {
            console.log('ups!' + error);
        }
    }
    async mapToObj(cryptoResponse) {
        const cryptoData = cryptoResponse.data.result.map((crypto) => {
            const newCryptoData = new CoinMarketData();
            newCryptoData.market_name = MARKET_NAME;
            newCryptoData.name = crypto.symbol;
            newCryptoData.price = crypto.price.toFixed(2);
            newCryptoData.saved_at = new Date();
            return newCryptoData;
        });
        return cryptoData;
    }
}
//# sourceMappingURL=CoinStatsApi.js.map