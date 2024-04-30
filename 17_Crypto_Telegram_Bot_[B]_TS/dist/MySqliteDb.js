import sqlite3 from 'sqlite3';
const DB_NAME = 'favorites.db';
const DB = new sqlite3.Database(DB_NAME);
export class MySqliteDb {
    static connection;
    constructor() { }
    static getConnection() {
        try {
            if (!MySqliteDb.connection) {
                MySqliteDb.connection = new sqlite3.Database(DB_NAME);
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return MySqliteDb.connection;
    }
    static createFavoritesTable() {
        MySqliteDb.connection.exec(`CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            favorite_cryptos TEXT
        )`);
    }
}
//# sourceMappingURL=MySqliteDb.js.map