import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const fibonacciNumbers: number[] = generateFibonacci(10);
        return {
            statusCode: 200,
            body: JSON.stringify(fibonacciNumbers),
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

function generateFibonacci(limit: number) {
    const fibonacciNumbers = [0, 1];

    for (let i = 2; i < limit; i++) {
        const nextNumber = fibonacciNumbers[i - 1] + fibonacciNumbers[i - 2];

        fibonacciNumbers.push(nextNumber);
    }

    return fibonacciNumbers;
}
