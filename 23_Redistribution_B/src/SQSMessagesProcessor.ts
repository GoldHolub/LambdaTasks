import { SQSHandler } from 'aws-lambda';
import { Client } from 'pg';

const setupScript = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    search_phrase TEXT,
    shop_id VARCHAR(255) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS shop_usage (
    shop_id VARCHAR(255) PRIMARY KEY,
    usage_count INTEGER DEFAULT 0
  );
`;

const createDbClient = () => {
  return new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

export const processSQSMessage: SQSHandler = async (event) => {
    const client = createDbClient();
    try {
      await client.connect();
      await client.query(setupScript);
  
      for (const record of event.Records) {
        const { name, password, search_phrase, shop_id } = JSON.parse(record.body);
  
        await client.query(
          'INSERT INTO users (name, password, search_phrase, shop_id) VALUES ($1, $2, $3, $4)',
          [name, password, search_phrase, shop_id]
        );
  
        await client.query(
          `INSERT INTO shop_usage (shop_id, usage_count) 
           VALUES ($1, 1) 
           ON CONFLICT (shop_id) DO 
           UPDATE SET usage_count = shop_usage.usage_count + 1`,
          [shop_id]
        );
  
        console.log('Successfully processed message for user:', name);
      }
    } catch (error) {
      console.error('Error processing SQS messages', error);
    } finally {
      await client.end();
    }
  };