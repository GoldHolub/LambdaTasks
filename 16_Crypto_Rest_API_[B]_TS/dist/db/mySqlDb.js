import { createConnection } from "typeorm";
import { CoinMarketData } from "../entities/CoinMarketData.js";
export class mySqlDb {
    static connection;
    constructor() { }
    static async getConnection() {
        try {
            if (!mySqlDb.connection) {
                mySqlDb.connection = await createConnection({
                    type: 'mysql',
                    driver: {},
                    host: 'my-mysql-crypto.internal',
                    port: 3306,
                    username: 'max',
                    password: '787898max',
                    database: 'coinmarket_data',
                    entities: [CoinMarketData],
                    synchronize: true,
                    connectTimeout: 30000
                });
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return mySqlDb.connection;
    }
}
//# sourceMappingURL=mySqlDb.js.map