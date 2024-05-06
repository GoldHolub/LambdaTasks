import { CoinMarketData } from "../../entities/CoinMarketData";

export interface ICryptoApi {
    getLatestCryptoData: () => Promise<any>; 
    mapToObj: (cryptoResponse: any) => Promise<CoinMarketData[]>;
}