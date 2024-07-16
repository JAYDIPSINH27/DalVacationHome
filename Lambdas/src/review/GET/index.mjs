// index.mjs
// TO test endpoint method: GET, URL: https://zwed7k68gi.execute-api.us-east-1.amazonaws.com/default/getReview?room_id=room123

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const USER_TABLE = 'User';

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (!event.queryStringParameters || !event.queryStringParameters.room_id) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({ error: "Missing room_id query parameter" }),
        };
    }

    const room_id = event.queryStringParameters.room_id;
    console.log("room_id:", room_id);

    const params = {
        TableName: USER_TABLE,
    };

    try {
        const data = await dynamodb.send(new ScanCommand(params));
        console.log("DynamoDB scan data:", JSON.stringify(data, null, 2));

        const reviews = [];

        data.Items.forEach(user => {
            if (user.reviews) {
                user.reviews.forEach(review => {
                    if (review.room_id === room_id) {
                        reviews.push({
                            user_id: user.UserID,
                            comment: review.comment,
                        });
                    }
                });
            }
        });

        console.log("Filtered reviews:", JSON.stringify(reviews, null, 2));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(reviews),
        };
    } catch (err) {
        console.error("Error during DynamoDB scan:", err);

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
