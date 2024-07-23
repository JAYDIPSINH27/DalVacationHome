// index.mjs

//GET Method (along with background sentiment analysis)
import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { LanguageServiceClient } from '@google-cloud/language';
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// Create DynamoDB and SSM clients
const dynamoClient = new DynamoDBClient({});
const ssmClient = new SSMClient({});

// Initialize Google Cloud Natural Language client
let languageClient;

const initializeLanguageClient = async () => {
    try {
        const credentials = await getGCPcredentials();
        languageClient = new LanguageServiceClient({ credentials });
        console.log("Google Cloud Natural Language client initialized successfully");
    } catch (error) {
        console.error("Error initializing Google Cloud Natural Language client:", error);
        throw error;
    }
};

// Function to get GCP credentials from AWS Parameter Store
const getGCPcredentials = async () => {
    const parameterName = 'gcp-credentials'; // Replace with your parameter name
    const command = new GetParameterCommand({ Name: parameterName, WithDecryption: true });
    const response = await ssmClient.send(command);
    return JSON.parse(response.Parameter.Value);
};

// Function to analyze sentiment using Google Natural Language API
const analyzeSentiment = async (text) => {
    if (!languageClient) {
        throw new Error("Language client is not initialized");
    }

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    try {
        const [result] = await languageClient.analyzeSentiment({ document });
        const sentiment = result.documentSentiment;

        return {
            score: sentiment.score,
            magnitude: sentiment.magnitude
        };
    } catch (error) {
        console.error("Error analyzing sentiment:", error);
        throw error;
    }
};

// Lambda handler function
export const handler = async (event) => {
    try {
        // Initialize language client before processing
        await initializeLanguageClient();

        const scanParams = {
            TableName: 'Feedback',
        };

        const scanCommand = new ScanCommand(scanParams);
        const scanResponse = await dynamoClient.send(scanCommand);
        const items = scanResponse.Items.map(item => unmarshall(item));

        const updatedItems = [];

        for (const item of items) {
            const feedbackId = item.feedbackId; // Use 'feedbackId'
            const feedbackText = item.comment; // Use 'comment'
            const userId = item.userId; // Use 'userId'
            const userName = item.userName; // Use 'UserName'
            const roomId = item.roomId; // Use 'roomId'
            const timeStamp = item.timeStamp; // Use 'timeStamp'

            // Perform sentiment analysis
            const sentiment = await analyzeSentiment(feedbackText);

            const updateParams = {
                TableName: 'Feedback',
                Key: marshall({ feedbackId }), // Use feedbackId as the key
                UpdateExpression: "SET sentiment_score = :s, sentiment_magnitude = :m",
                ExpressionAttributeValues: marshall({
                    ":s": sentiment.score,
                    ":m": sentiment.magnitude
                }),
                ReturnValues: "ALL_NEW"
            };

            const updateCommand = new UpdateItemCommand(updateParams);
            await dynamoClient.send(updateCommand);

            updatedItems.push({
                userId: item.userId || 'Unknown User ID',
                userName: item.userName || 'Unknown User Name',
                roomId: item.roomId || 'Unknown Room ID',
                comment: item.comment || 'No comment provided',
                sentimentScore: sentiment.score,
                sentimentMagnitude: sentiment.magnitude,
                timeStamp: item.timeStamp || 'No timestamp provided'
            });
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*', // Allow all origins or specify your domain
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                message: 'Sentiment analysis completed for all feedback items',
                items: updatedItems
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*', // Allow all origins or specify your domain
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                message: `Error occurred: ${error.message}`
            }),
        };
    }
};
 