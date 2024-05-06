import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
import { ICryptoApi } from "../ICryptoApi.js";

const COIN_MARKET_ENDPOINT: string = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const API_KEY: string = '64aa3cf6-5264-4dc3-9a1e-2e43c786c063';
const MARKET_NAME: string = 'CoinMarketCap'
const CRYPTOCURRENCY_LIMIT: number = 30;


export class CoinMarketApi implements ICryptoApi {
    async getLatestCryptoData(): Promise<any> {
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
        } catch (error) {
            console.error('Error fetching cryptocurrency data from CoinMarketCap:', error);
            throw error;
        }
    }
    async mapToObj(cryptoResponse: any): Promise<CoinMarketData[]> {
        const cryptoData: CoinMarketData[] = cryptoResponse.data.data.map((crypto: any) => {
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
