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
    const email = event.email;
    const originalText = event.originalText;
    const encryptedText = event.encryptedText;
    
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
        
        const cipherKey = getEmailResponse.Item.cipherKey
        
        const expectedEncryptionResult = encrypt(originalText, cipherKey);
        
        // Compare encrypted word
        if (expectedEncryptionResult === encryptedText) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: `Caesar cipher challenge successful. Expected encryption result: ${expectedEncryptionResult}` }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `Caesar cipher challenge unsuccessful. Expected encryption result: ${expectedEncryptionResult}`}),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could check cipher text', details: error.message }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

function encrypt(text, key) {
    // Implement Caesar cipher encryption here
    // For simplicity, assuming text and key are both uppercase letters
    
    let encryptedText = '';
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        charCode = ((charCode - 65 + key) % 26 + 26) % 26 + 65;
        encryptedText += String.fromCharCode(charCode);
    }
    return encryptedText;
}


export { handler };
