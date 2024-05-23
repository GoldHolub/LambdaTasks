import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import multipart from 'lambda-multipart-parser';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import FormData from 'form-data';
import fetch from 'node-fetch';

const s3 = new S3Client({ region: process.env.REGION! });
const dynamodb = new DynamoDB.DocumentClient({ region: process.env.REGION! });
const bucketName = process.env.BUCKET_NAME!;
const tableName = process.env.TABLE_NAME!;

export const generateUploadUrl: APIGatewayProxyHandler = async (event) => {
  try {
    const result = await multipart.parse(event);
    const imageFile = result.files[0];

    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'the image file is empty',
        }),
      };
    }
    const imageId = `image-${Date.now()}.${imageFile.contentType.split('/')[1]}`;
    const originalName = imageFile.filename;
    const s3Params = {
      Bucket: bucketName,
      Key: imageId,
      Expires: 3600,
      ContentType: imageFile.contentType,
    };
    const { url, fields } = await createPresignedPost(s3, s3Params);
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const fileContentBuffer = Buffer.from(imageFile.content);
    formData.append('file', fileContentBuffer, {
      filename: imageFile.filename,
      contentType: imageFile.contentType,
      knownLength: fileContentBuffer.length
    });
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to S3');
    }

    const imageUrl = `https://${bucketName}.s3.eu-north-1.amazonaws.com/${imageId}`;
    const userId = event.requestContext.authorizer?.claims.sub;
    const imageItem = {
      imageId: imageId,
      originalName: originalName,
      imageUrl: url,
      userId: userId
    };

    await dynamodb.put({ TableName: tableName, Item: imageItem }).promise().then(() => {
      console.log('table content');
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl
      })
    };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to upload image',
        error: error,
      }),
    };
  }
};
