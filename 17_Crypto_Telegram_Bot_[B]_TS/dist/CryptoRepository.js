import { MySqliteDb } from "./MySqliteDb.js";
export class CryptoRepository {
    async deleteFromFavorites(username, cryptoSymbol) {
        const db = MySqliteDb.getConnection();
        await db.run('DELETE FROM favorites WHERE username = ? AND favorite_cryptos = ?', [username, cryptoSymbol], (err) => {
            if (err) {
                console.error('Error removing from favorites:', err);
                throw err;
            }
            else {
                console.log(`${cryptoSymbol} removed from favorites`);
            }
        });
    }
    async addToFavorites(username, cryptoSymbol) {
        const db = MySqliteDb.getConnection();
        await db.run(`INSERT OR IGNORE INTO favorites (username, favorite_cryptos) 
            VALUES (?, ?)`, [username, cryptoSymbol], async (err) => {
            if (err) {
                console.error('Error adding to favorites:', err);
                throw err;
            }
            else {
                console.log(`${cryptoSymbol} added to favorites`);
            }
        });
    }
}
//# sourceMappingURL=CryptoRepository.js.map