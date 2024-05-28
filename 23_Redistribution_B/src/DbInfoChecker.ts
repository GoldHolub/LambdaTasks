import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';

export const handler: APIGatewayProxyHandler = async () => {
    const client = createDbClient();
    try {

        await provideDbConnection(client);

        const result = await client.query('SELECT shop_id, usage_count FROM shop_usage');
        const usageData = result.rows;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Shop usage data retrieved successfully',
                data: usageData
            }),
        };
    } catch (error) {
        console.error('Error retrieving shop usage data', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error
            }),
        };
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

const provideDbConnection = async (client: Client) => {
    await client.connect();
    console.log('Client connected successfully');
  };
