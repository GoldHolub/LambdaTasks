import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const name: string = event.queryStringParameters?.name || 'anonymous';
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello, ${name}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal error happened',
            }),
        };
    }
};
