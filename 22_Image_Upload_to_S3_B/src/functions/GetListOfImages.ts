import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const tableName: string = process.env.TABLE_NAME!;
const bucketName = process.env.BUCKET_NAME!;
const s3 = new S3Client({ region: process.env.REGION! });
const dynamodb = new DynamoDB.DocumentClient({ region: process.env.REGION! });

export const listUserImages: APIGatewayProxyHandler = async (event) => {
    try {
        const userId: string = event.requestContext.authorizer?.claims.sub;
        const params = {
            TableName: tableName,
            IndexName: 'userId-index',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        const result = await dynamodb.query(params).promise();
        if (!result.Items) {
            return {
                statusCode: 200,
                body: JSON.stringify('your image bucket is empty'),
            };
        }
        for (const imageItem of result.Items) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: imageItem.imageId
            }
            const command = new GetObjectCommand(getObjectParams);
            const newImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            imageItem.imageUrl = newImageUrl;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        console.error('Error listing images:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to list images', error: error }),
        };
    }
};