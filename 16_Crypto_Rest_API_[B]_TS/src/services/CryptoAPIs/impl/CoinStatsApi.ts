import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
import { ICryptoApi } from "../ICryptoApi.js";

const CRYPTOCURRENCY_LIMIT: number = 30;
const COIN_STATS_ENDPOINT: string = `https://openapiv1.coinstats.app/coins?limit=${CRYPTOCURRENCY_LIMIT}`;
const API_KEY: string = 'GbHbes7hU/Bx9iYaJNXfIsHhpBwujCxJcVNXtjT5P+w=';
const MARKET_NAME: string = 'CoinStats';

export class CoinStatsApi implements ICryptoApi {
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

    async mapToObj(cryptoResponse: any): Promise<CoinMarketData[]> {
        const cryptoData: CoinMarketData[] = cryptoResponse.data.result.map((crypto: any) => {
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
