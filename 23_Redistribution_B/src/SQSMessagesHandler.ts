import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from '@aws-sdk/client-sqs';
import { Client } from 'pg';

const validShops = ['shop1', 'shop2', 'shop3', 'shop4', 'shop5'];
const queueUrl: string = process.env.SQS_QUEUE_URL!;
const sqs = new SQS({ apiVersion: '2012-11-05' });
const API_CALLS_LIMIT = 12000;

export const handler: APIGatewayProxyHandler = async (event) => {
  const client = createDbClient();
  try {
    await client.connect();
    const { name, password, search_phrase, shop_id } = JSON.parse(event.body || '{}');

    if (!validShops.includes(shop_id)) {
      console.log('Invalid shop ID:', shop_id);
      return { statusCode: 400, body: `'Invalid shop ID:' ${shop_id}` };
    }

    const result = await client.query('SELECT usage_count FROM shop_usage WHERE shop_id = $1', [shop_id]);
    const usageCount = result.rows[0] ? result.rows[0].usage_count : 0;

    if (usageCount >= API_CALLS_LIMIT) {
      const responseMessage = `Usage limit reached for shop: ${shop_id}`;
      console.log(responseMessage);
      return { statusCode: 200, body: responseMessage };
    }

    const message = {
      name,
      password,
      search_phrase,
      shop_id,
    };

    await sqs.sendMessage({
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    });
    return { statusCode: 200, body: 'Request is being processed successfully' };
  } catch (error) {
    console.log('Error processing request', error);
    return { statusCode: 500, body: 'Internal server error - Error processing request' };
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

