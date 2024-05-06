import axios from "../../../node_modules/axios/index.js";
const COIN_STATS_ENDPOINT = 'https://api.coinstats.app/public/v1/coins?skip=0&limit=10';
export class CoinStatsApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(COIN_STATS_ENDPOINT, {
                headers: {}
            });
            return response;
        }
        catch {
            console.log('ups!');
        }
    }
    async getParticularCryptoData() {
    }
}
const coinStatsApi = new CoinStatsApi();
await coinStatsApi.getLatestCryptoData();
//# sourceMappingURL=CoinStatsApi.js.map