// Import required AWS SDK clients and commands for Node.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    const params = {
        TableName: "rooms",
    };

    try {
        console.log("Scanning table:", params.TableName);
        const data = await client.send(new ScanCommand(params));
        const items = data.Items
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(items),
        };
    } catch (err) {
        console.error(err);
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
