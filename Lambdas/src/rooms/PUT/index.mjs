import * as parser from 'lambda-multipart-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const s3 = new S3Client();
const dynamoDB = new DynamoDBClient();

const BUCKET_NAME = 'csci5410-s24-sdp-5-room-images';
const TABLE_NAME = 'rooms';

export const handler = async (event) => {
  console.log({ event });

  try {
    // Parse the multipart form data
    const result = await parser.parse(event);
    console.log({ result });

    // Extract fields
    const { room_number, name, price, capacity, files, description } = result;
    const image = files ? files[0] : null;
    
    console.log({
      room_number,
      name,
      price,
      capacity,
      image
    });

    // Validate and convert data types
    if (!room_number || !name || !price || !capacity || !description) {
      throw new Error('Missing required fields!!');
    }

    const pricePerNight = parseFloat(price);
    const capacityValue = parseInt(capacity, 10);
    let imageUrl;

    // Upload new image to S3 if provided
    if (image) {
      const imageKey = `${uuidv4()}-${image.filename}`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: Buffer.from(image.content, 'binary'),
        ContentType: image.contentType
      };
      const imageUploadResult = await s3.send(new PutObjectCommand(uploadParams));
      imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
    }

    // Update room info in DynamoDB
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { room_number: { N: room_number.toString() } },
      UpdateExpression: 'set #name = :name, #price = :price, #capacity = :capacity, #description = :description' + (imageUrl ? ', #image = :image' : ''),
      ExpressionAttributeNames: {
        '#name': 'name',
        '#price': 'price',
        '#capacity': 'capacity',
        '#description': 'description',
        ...(imageUrl && { '#image': 'image' })
      },
      ExpressionAttributeValues: {
        ':name': { S: name },
        ':price': { N: pricePerNight.toString() },
        ':capacity': { N: capacityValue.toString() },
        ':description': { S: description.toString() },
        ...(imageUrl && { ':image': { S: imageUrl } })
      },
      ReturnValues: 'ALL_NEW'
    };

    const updateResult = await dynamoDB.send(new UpdateItemCommand(updateParams));
    const updatedItem = unmarshall(updateResult.Attributes);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
      },
      body: JSON.stringify({ message: 'Room information updated successfully', data: updatedItem }),
    };
    return response;

  } catch (error) {
    console.error('Error processing the request:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
