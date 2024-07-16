// postReview
/*To test endpoint, Method: POST, URL:https://zwed7k68gi.execute-api.us-east-1.amazonaws.com/default/postReview,
 body: {
  "user_id": "user12",
   "room_id": "room123",
  "comment": "This is a sample3 review."
 } */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const USER_TABLE = 'User';

export const handler = async (event) => {
    const { user_id, room_id, comment } = JSON.parse(event.body);

    const getUserParams = {
        TableName: USER_TABLE,
        Key: { UserID: user_id }
    };

    try {
        const getCommand = new GetCommand(getUserParams);
        const data = await client.send(getCommand);

        if (!data.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify({ message: 'User not found.' }),
            };
        }

        const reviews = data.Item.reviews || [];
        reviews.push({ room_id, comment });

        const updateUserParams = {
            TableName: USER_TABLE,
            Key: { UserID: user_id },
            UpdateExpression: 'set reviews = :reviews',
            ExpressionAttributeValues: {
                ':reviews': reviews
            }
        };

        const updateCommand = new UpdateCommand(updateUserParams);
        await client.send(updateCommand);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({ message: 'Review added successfully.' }),
        };
    } catch (err) {
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
