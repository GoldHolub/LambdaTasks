import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda';
import { Client } from 'pg';
import AWS from 'aws-sdk';

const validShops = ['shop1', 'shop2', 'shop3', 'shop4', 'shop5'];

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

export const handler: SQSHandler = async (event: SQSEvent): Promise<any> => {
  const client = createDbClient();
  try {
    await provideDbConnectionAndSetup(client);
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const { name, password, search_phrase, shop_id } = messageBody;

      if (!validShops.includes(shop_id)) {
        console.log('Invalid shop ID:', shop_id);
        continue;
      }

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
      console.log('successfully inserted data into DB: name-' + name);

      const result = await client.query('SELECT usage_count FROM shop_usage WHERE shop_id = $1', [shop_id]);
      const usageCount = result.rows[0].usage_count;

      if (usageCount >= 10000) {
        console.log(`Usage limit reached for shop: ${shop_id}`);
      }
    }
    console.log('Messages processed successfully');
    return { statusCode: 200, body: 'Messages processed successfully' };
  } catch (error) {
    console.error('Error processing messages', error);
    return { statusCode: 500, body: 'Internal server error' };
  } finally {
    await client.end();
  }
};

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

const provideDbConnectionAndSetup = async (client: Client) => {
  await client.connect();
  console.log('Client connected successfully');
  await client.query(setupScript);
  console.log('Database setup completed');
};