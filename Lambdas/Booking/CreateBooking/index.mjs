// Import required modules
import AWS from 'aws-sdk'; // AWS SDK for JavaScript
import { v4 as uuidv4 } from 'uuid'; // UUID for generating unique IDs

// Initialize AWS SDK
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Lambda handler function
export const handler = async (event) => {
    // Enable CORS for all origins
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let statusCode = 200;
    let responseBody = {};

    try {
        // Parse incoming event body (assuming JSON input)
        const data = JSON.parse(event.body);

        // Validate input data (add your own validation logic as needed)
        if (!data.roomId || !data.startDate || !data.endDate || !data.userName || !data.email) {
            statusCode = 400;
            responseBody = { message: 'Missing required fields.' };
        } else {
            // Generate a unique booking ID
            const bookingId = uuidv4();

            // Prepare the item to be put into DynamoDB
            const params = {
                TableName: 'BookingsTable', // Replace with your DynamoDB table name
                Item: {
                    bookingId: bookingId,
                    roomId: data.roomId,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    userName: data.userName,
                    email: data.email,
                    createdAt: new Date().toISOString(),
                },
            };

            // Put item into DynamoDB
            await dynamoDb.put(params).promise();

            // Set success response
            responseBody = { message: 'Booking created successfully.', bookingId };
            statusCode = 201;
        }
    } catch (error) {
        // Set error response
        responseBody = { message: 'Failed to create booking.', error: error.message };
        statusCode = 500;
    }

    // Return final response
    return {
        statusCode,
        headers,
        body: JSON.stringify(responseBody),
    };
};
