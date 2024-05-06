export class InitialSchema1612345678901 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE DATABASE IF NOT EXISTS crypto_data;
            USE crypto_data;
            CREATE TABLE IF NOT EXISTS coinmarket_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                price DECIMAL(12, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    async down(queryRunner) {
        // Reverse the migration if needed
    }
}
//# sourceMappingURL=InitialSchema.js.map