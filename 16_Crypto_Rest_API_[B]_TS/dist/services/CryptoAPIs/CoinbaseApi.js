import axios from "../../../node_modules/axios/index.js";
const API = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
export class CoinbaseApi {
    async getLatestCryptoData() {
        try {
            const response = await axios.get(API);
            return response;
        }
        catch (error) {
            console.log('ups!');
        }
    }
    async getParticularCryptoData() {
    }
}
//const coinbaseApi: ICryptoApi = new CoinbaseApi();
//coinbaseApi.getLatestCryptoData();
//# sourceMappingURL=CoinbaseApi.js.map