import { CoinMarketData } from "../entities/CoinMarketData";
export const getConnectionInfo = () => {
    return {
        type: 'mysql',
        driver: {},
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '787898max!',
        database: 'coinmarket_data',
        entities: [CoinMarketData],
        synchronize: true,
    };
};
//# sourceMappingURL=db.js.map