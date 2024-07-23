// index.mjs
// TO test endpoint method: GET

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client and document client.
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

// Define the Feedback table name.
const FEEDBACK_TABLE = 'Feedback';

// Lambda handler function to process incoming events.
export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Define parameters for scanning the Feedback table.
    const feedbackParams = {
        TableName: FEEDBACK_TABLE,
    };

    try {
        // Scan the Feedback table to retrieve all entries.
        const feedbackData = await dynamodb.send(new ScanCommand(feedbackParams));
        console.log("DynamoDB scan data:", JSON.stringify(feedbackData, null, 2));

        // Process feedback data to include user and room information.
        const feedbackWithDetails = feedbackData.Items.map((feedback) => {
            return {
                userId: feedback.userId || 'Unknown User ID',
                userName: feedback.userName || 'Unknown User Name',
                roomId: feedback.roomId || 'Unknown Room ID',
                comment: feedback.comment || 'No comment provided',
                timeStamp: feedback.timeStamp || 'No timestamp provided'
            };
        });

        console.log("Feedback with user and room details:", JSON.stringify(feedbackWithDetails, null, 2));

        // Return the list of feedback with user and room details.
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(feedbackWithDetails),
        };
    } catch (err) {
        console.error("Error during DynamoDB scan:", err);

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
