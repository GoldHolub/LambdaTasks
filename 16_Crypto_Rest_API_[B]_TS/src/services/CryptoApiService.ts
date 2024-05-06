import { CurrencyResponseDto } from "../dto/CurrencyResponseDto.js";
import { CurrencyResponseForAveragePriceDto } from "../dto/CurrencyResponseForAveragePriceDto.js";
import { CoinMarketData } from "../entities/CoinMarketData.js";
import { CryptocurrencyRepository } from "../repositories/CryptocurrencyRepository.js";
import { ICryptoApi } from "./CryptoAPIs/ICryptoApi";
import { CoinMarketApi } from "./CryptoAPIs/impl/CoinMarketApi.js";
import { CoinStatsApi } from "./CryptoAPIs/impl/CoinStatsApi.js";
import { CoinbaseApi } from "./CryptoAPIs/impl/CoinbaseApi.js";
import { KucoinApi } from "./CryptoAPIs/impl/KucoinApi.js";
import { CoinPaprikaApi } from "./CryptoAPIs/impl/CoinPaprikaApi.js";
import { mySqlDb } from "../db/mySqlDb.js";
import { Repository } from "typeorm";

const TAKE_FROM_DB_LIMIT: number = 5 * 30;
const marketMap: Map<string, ICryptoApi> = new Map();
marketMap.set('CoinMarketCap', new CoinMarketApi());
marketMap.set('CoinBase', new CoinbaseApi());
marketMap.set('CoinStats', new CoinStatsApi());
marketMap.set('Kucoin', new KucoinApi());
marketMap.set('CoinPaprika', new CoinPaprikaApi());

export class CryptoApiService {
    static async updateDbWithCryptoData() {
        const marketMapKeys = marketMap.keys();
        for (const [key, cryptoApi] of marketMap.entries()) {
            const cryptoData = await cryptoApi.getLatestCryptoData();
            const coinMarketData: CoinMarketData[] = await cryptoApi.mapToObj(cryptoData);

            const cryptocurrencyRepository = new CryptocurrencyRepository();
            cryptocurrencyRepository.loadCryptoDataToDb(coinMarketData);
        }
    }

    static async getCryptoWithAveragePriceInRange(currency: string, timePeriod: number): Promise<CurrencyResponseForAveragePriceDto[]> {
        const now = new Date();
        let startTime: Date = new Date(now.getTime() - timePeriod);
        const interval: number = 5 * 60 * 1000;
        const numberOfIntervals: number = Math.floor(timePeriod / interval);

        const cryptocurrencyRepository = new CryptocurrencyRepository();
        const currencyArray: CurrencyResponseForAveragePriceDto[] = [];
        for (let i = 0; i < numberOfIntervals; i++) {
            const endTime = new Date(startTime.getTime() + interval);
            const results: any[] = await cryptocurrencyRepository.getCurrencyInRange(currency, startTime, endTime);
            if (results.length == 0) {
                startTime = new Date(startTime.getTime() + interval);
                continue;
            }
            const sum = results.reduce((acc, curr) => acc + parseFloat(curr.coin_market_data_price), 0);
            const averagePrice: string = (sum / results.length).toFixed(2);

            const cryptoCurrency = new CurrencyResponseForAveragePriceDto();
            cryptoCurrency.name = currency;
            cryptoCurrency.saved_at = results[0].coin_market_data_saved_at;
            cryptoCurrency.price = averagePrice;
            currencyArray.push(cryptoCurrency);

            startTime = new Date(startTime.getTime() + interval);
        }

        return currencyArray;
    }


    static async getCryptoInRangeForMarket(currency: string, timePeriod: number, market: string) {
        const now = new Date();
        let startTime: Date = new Date(now.getTime() - timePeriod);

        const currencyArray: CurrencyResponseDto[] = [];
        const cryptocurrencyRepository = new CryptocurrencyRepository();
        const results: any[] = await cryptocurrencyRepository.getCurrencyInRange(currency, startTime, now, market);

        for (let i = 0; i < results.length; i++) {
            const cryptoCurrency = new CurrencyResponseDto();
            cryptoCurrency.market_name = market;
            cryptoCurrency.name = currency;
            cryptoCurrency.saved_at = results[i].coin_market_data_saved_at;
            cryptoCurrency.price = results[i].coin_market_data_price;
            currencyArray.push(cryptoCurrency);
        }
        return currencyArray;
    }

    static async getListOfHypedCryptocurrencies() {
        const connection = await mySqlDb.getConnection();
        const coinMarketDataRepository: Repository<CoinMarketData> = connection.getRepository(CoinMarketData);

        const cryptoData: CoinMarketData[] = await coinMarketDataRepository.find({
            order: {
                saved_at: "DESC" 
            },
            take: TAKE_FROM_DB_LIMIT
        });

        interface priceData {
            price: number,
            count: number
        }

        const cryptoMap: Map<string, priceData> = new Map();
        cryptoData.forEach(crypto => {
            const symbol = crypto.name;
            const price = +crypto.price;
            const currentValue = cryptoMap.get(symbol);
            if (currentValue) {
                cryptoMap.set(symbol, {
                    price: currentValue.price + price,
                    count: currentValue.count + 1
                });
            } else {
                cryptoMap.set(symbol, {price, count: 1});
            }
        });

        const sortedCryptos = [...cryptoMap.entries()].sort((a, b) => b[1].count - a[1].count);
        const top20Cryptos = sortedCryptos.slice(0, 20);

        const formattedCryptos = top20Cryptos.map(([symbol, priceData]) => {
            const averagePrice = priceData.price / priceData.count; 
            return `${symbol} $${averagePrice.toFixed(2)}`;
        });

        return formattedCryptos;
    }
}
