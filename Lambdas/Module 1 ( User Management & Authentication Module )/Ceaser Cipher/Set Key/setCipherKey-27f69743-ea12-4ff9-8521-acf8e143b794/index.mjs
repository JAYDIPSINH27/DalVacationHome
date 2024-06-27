import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const handler = async (event) => {
    console.log('Event:', event);
    const cipherKey = event.cipherKey;
    const email = event.email;
    
    try {
        // Check if email exists
        const getEmailParams = {
            TableName: 'usersTable',
            Key: {
                email: email
            }
        };
        const getEmailResponse = await dynamodb.send(new GetCommand(getEmailParams));
        if (!getEmailResponse.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Email not found' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
        
        // Add cipherKey as another attribute to the email
        const putParams = {
            TableName: 'usersTable',
            Item: {
                email: email,
                cipherKey: cipherKey
            }
        };
        
        await dynamodb.send(new PutCommand(putParams));
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Cipher Key stored successfully' }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not register user', details: error.message }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

export { handler };
