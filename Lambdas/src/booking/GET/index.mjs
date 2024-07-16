// Import required AWS SDK clients and commands for Node.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
    CognitoIdentityProviderClient,
    GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const cognitoClient = new CognitoIdentityProviderClient({
    region: "us-east-1",
});

const verifyToken = async (token) => {
    try {
        const params = {
            AccessToken: token,
        };
        const command = new GetUserCommand(params);
        const response = await cognitoClient.send(command);
        return response;
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const handler = async (event) => {
    const authHeader = event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            body: JSON.stringify({ error: "Unauthorized" }),
        };
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await verifyToken(token);
        console.log("User is authenticated:", decoded);

        const params = {
            TableName: "BookingsTable",
        };

        console.log("Scanning table:", params.TableName);
        const data = await dynamoDbClient.send(new ScanCommand(params));
        const items = data.Items;

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            body: JSON.stringify(items),
        };
    } catch (error) {
        console.error(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
