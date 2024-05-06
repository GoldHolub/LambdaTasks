import axios from "../../../node_modules/axios/index.js";
const COIN_MARKET_ENDPOINT = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const API_KEY = '64aa3cf6-5264-4dc3-9a1e-2e43c786c063';
const CRYPTOCURRENCY_LIMIT = 40;
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
            const cryptoData = response.data.data.map((crypto) => {
                return {
                    name: crypto.symbol,
                    price: crypto.quote.USD.price.toFixed(2)
                };
            });
            return cryptoData;
        }
        catch (error) {
            console.error('Error fetching cryptocurrency data from CoinMarketCap:', error);
            throw error;
        }
    }
    async getParticularCryptoData(cryptoSymbol) {
        try {
        }
        catch (error) {
            console.error('Error fetching cryptocurrency data from CoinMarketCap:', error);
            throw error;
        }
    }
}
const coinMarketApi = new CoinMarketApi();
coinMarketApi.getLatestCryptoData();
//# sourceMappingURL=CoinMarketApi.js.map