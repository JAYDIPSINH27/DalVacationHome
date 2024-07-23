// postReview
/*To test endpoint, Method: POST, URL:https://zwed7k68gi.execute-api.us-east-1.amazonaws.com/default/postReview,
 body: {
  "email": "user1@gmail.com",
  "comment": "Not happy at all",
  "bookingReferenceCode": "booking1"
 } */

//POST method
// Import necessary AWS SDK clients and commands.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'; // Importing UUID to generate unique feedback IDs.

// Initialize DynamoDB client and document client.
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

// Define the Feedback and Bookings table names.
const FEEDBACK_TABLE = 'Feedback';
const BOOKINGS_TABLE = 'BookingsTable'; // Using the correct table name

// Lambda handler function to process incoming events.
export const handler = async (event) => {
    try {
        // Parse the JSON body of the incoming request.
        const { email, comment, bookingReferenceCode } = JSON.parse(event.body);

        // Define parameters to scan the BookingsTable for matching email and bookingReferenceCode.
        const scanBookingsParams = {
            TableName: BOOKINGS_TABLE,
            FilterExpression: 'bookingId = :bookingRefCode AND email = :email',
            ExpressionAttributeValues: {
                ':bookingRefCode': bookingReferenceCode,
                ':email': email
            }
        };

        // Retrieve booking data using the provided booking reference code and email.
        const bookingData = await dynamodb.send(new ScanCommand(scanBookingsParams));

        // Check if any booking matches the booking reference code and email.
        if (bookingData.Items.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify({ message: 'Invalid booking reference code or email. Feedback can only be given by customers who have booked a room.' }),
            };
        }

        // Extract userId, userName, and roomId from the first matching booking data (assuming booking reference code is unique).
        const { userId, userName, roomId } = bookingData.Items[0];

        // Generate a unique feedback ID.
        const feedbackId = uuidv4();

        // Define parameters for storing feedback in the Feedback table.
        const feedbackParams = {
            TableName: FEEDBACK_TABLE,
            Item: {
                feedbackId: feedbackId,
                userId: userId,
                userName: userName, // Store the user name as part of the feedback
                roomId: roomId,     // Store the room ID as part of the feedback
                comment: comment,
                timeStamp: new Date().toISOString()
            },
        };

        // Execute the PutCommand to store feedback.
        await dynamodb.send(new PutCommand(feedbackParams));

        // Return success response.
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({ message: 'Feedback added successfully.' }),
        };
    } catch (err) {
        // Return error response if an exception occurs.
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
