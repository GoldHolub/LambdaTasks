import axios from "../../../../node_modules/axios/index.js";
import { CoinMarketData } from "../../../entities/CoinMarketData.js";
const COIN_STATS_ENDPOINT = 'https://api.kucoin.com/api/v1/market/allTickers';
const MARKET_NAME = 'Kucoin';
export class KucoinApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(COIN_STATS_ENDPOINT);
            const relevantPairs = response.data.data.ticker.filter((pair) => pair.symbol.includes('USDT'));
            relevantPairs.sort((a, b) => {
                const scoreA = a.volValue * a.changeRate;
                const scoreB = b.volValue * b.changeRate;
                return scoreB - scoreA;
            });
            const limitedPairs = relevantPairs.slice(0, 30);
            return limitedPairs;
        }
        catch (error) {
            console.log('ups! ' + error);
        }
    }
    async mapToObj(limitedPairs) {
        const cryptoData = limitedPairs.map((crypto) => {
            const newCryptoData = new CoinMarketData();
            newCryptoData.market_name = MARKET_NAME;
            newCryptoData.name = crypto.symbol.split('-')[0];
            newCryptoData.price = parseFloat((+crypto.buy).toFixed(2));
            newCryptoData.saved_at = new Date();
            return newCryptoData;
        });
        return cryptoData;
    }
}
//# sourceMappingURL=KucoinApi.js.map