import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const handler = async (event) => {
    try {
        // Parameters for scanning the DynamoDB table
        const params = {
            TableName: 'Rooms',
        };
        
        // Scan the DynamoDB table to fetch all items
        const { Items } = await dynamodb.send(new ScanCommand(params));
        
        // Return the fetched items
        return {
            statusCode: 200,
            body: JSON.stringify(Items),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (err) {
        // Return error response if there's any issue
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};

export { handler };
