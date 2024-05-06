import { CoinMarketData } from "../entities/CoinMarketData.js";
import { mySqlDb } from "../db/mySqlDb.js";
export class CryptocurrencyRepository {
    async getCurrencyInRange(currency, startDate, endDate, market) {
        const connection = await mySqlDb.getConnection();
        const coinMarketDataRepository = connection.getRepository(CoinMarketData);
        let queryBuilder = coinMarketDataRepository
            .createQueryBuilder('coin_market_data')
            .where('coin_market_data.name = :currency', { currency })
            .andWhere('coin_market_data.saved_at >= :startDate', { startDate })
            .andWhere('coin_market_data.saved_at <= :endDate', { endDate });
        if (market) {
            queryBuilder.andWhere('coin_market_data.market_name = :market', { market });
        }
        const cryptoData = await queryBuilder.getRawMany();
        return cryptoData;
    }
    async loadCryptoDataToDb(cryptoData) {
        await mySqlDb.getConnection()
            .then(async (connection) => {
            const cryptoRepository = connection.getRepository(CoinMarketData);
            await cryptoRepository.save(cryptoData);
            console.log(`Crypto data saved successfully to ${cryptoData[0].market_name}`);
        }).catch((error) => console.error('Error connecting to the database:', error));
    }
}
//# sourceMappingURL=CryptocurrencyRepository.js.map