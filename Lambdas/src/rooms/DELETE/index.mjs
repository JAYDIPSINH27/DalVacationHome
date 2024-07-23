import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Client
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

// The name of your DynamoDB table
const TABLE_NAME = "rooms";

export const handler = async (event) => {
    // Extract the ID from the event
    const data = JSON.parse(event.body);
    const { room_number } = data;

    if (!room_number) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
              },
            body: JSON.stringify({ message: "room_number is required" }),
        };
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            room_number: room_number,
        },
    };

    try {
        // Delete the item from the DynamoDB table
        await dynamoDB.send(new DeleteCommand(params));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
              },
            body: JSON.stringify({ message: "Room deleted successfully" }),
        };
    } catch (error) {
        console.error("Error deleting item:", error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
              },
            body: JSON.stringify({
                message: "Error deleting room",
                error: error.message,
            }),
        };
    }
};
