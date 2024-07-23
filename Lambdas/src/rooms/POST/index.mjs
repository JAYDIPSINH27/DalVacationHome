import * as parser from 'lambda-multipart-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
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
    const { name, price, capacity, files, description } = result;
    const image = files[0]
    
    console.log({
      name,
      price,
      capacity,
      image
    })

    // Validate and convert data types
    if (!name || !price || !capacity || !image || !description) {
      throw new Error('Missing required fields!!');
    }

    const pricePerNight = parseFloat(price);
    const capacityValue = parseInt(capacity, 10);

    // Upload image to S3
    const imageKey = `${uuidv4()}-${image.filename}`;
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: imageKey,
      Body: Buffer.from(image.content, 'binary'),
      ContentType: image.contentType
    };
    const imageUploadResult = await s3.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;

    // Generate unique room number
    const roomNumber = await generateRoomNumber();

    // Save room info to DynamoDB
    const roomData = {
      room_number: { N: roomNumber.toString() },
      name: { S: name },
      dates: { L: [] },
      description: { S: description.toString() },
      price: { N: pricePerNight.toString() },
      capacity: { N: capacityValue.toString() },
      image: { S: imageUrl }
    };

    await dynamoDB.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: roomData
    }));

const response = {
      statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
      body: JSON.stringify({ message: 'Room information saved successfully', data: unmarshall(roomData) }),
    };
    return response;

  } catch (error) {
    console.error('Error processing the request:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// Function to generate a unique room number
const generateRoomNumber = async () => {
  const scanParams = {
    TableName: TABLE_NAME,
    ProjectionExpression: 'room_number'
  };

  const scanResults = [];
  let lastEvaluatedKey;
  do {
    const result = await dynamoDB.send(new ScanCommand({
      ...scanParams,
      ExclusiveStartKey: lastEvaluatedKey
    }));
    result.Items.forEach((item) => scanResults.push(parseInt(item.room_number.N, 10)));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  const roomNumber = scanResults.length > 0 ? Math.max(...scanResults) + 1 : 1;
  return roomNumber;
};
