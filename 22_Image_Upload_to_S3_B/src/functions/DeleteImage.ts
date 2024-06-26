import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const deleteImage: APIGatewayProxyHandler = async (event) => {
    try {
        const tableName = process.env.TABLE_NAME!;
        const bucketName = process.env.BUCKET_NAME!;
        const dynamodb = new DynamoDB.DocumentClient({ region: process.env.REGION! });
        const s3 = new S3Client({ region: process.env.REGION! });
        const userId = event.requestContext.authorizer?.claims.sub;
        const { imageIds } = JSON.parse(event.body!);

        if (!imageIds || !Array.isArray(imageIds)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Provide an array of image ids in JSON body' }),
            };
        }

        for (const imageId of imageIds) {
            const dynamodbParams = {
                TableName: tableName,
                Key: { imageId },
            };

            const result = await dynamodb.get(dynamodbParams).promise();
            const image = result.Item;

            if (!image || image.userId !== userId) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: `Image with id ${imageId} not found or unauthorized` }),
                };
            }

            const deleteObjectParams = {
                Bucket: bucketName,
                Key: image.imageId,
            };
            const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
            await s3.send(deleteCommand);
            await dynamodb.delete(dynamodbParams).promise();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Images deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete image', error: error }),
        };
    }
};