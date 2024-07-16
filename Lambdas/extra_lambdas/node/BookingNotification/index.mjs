// Connect this handler to the SQS queue

import AWS from "aws-sdk"; // AWS SDK for JavaScript

// Initialize AWS SDK
const sns = new AWS.SNS({ region: "us-east-1" }); // Replace 'your-region' with your AWS region
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Lambda handler function
export const handler = async (event) => {
    try {
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            const getTopicArnByName = async (topicName) => {
                let nextToken = null;
                do {
                    const listTopicsParams = {
                        NextToken: nextToken,
                    };
                    const topicsResponse = await sns
                        .listTopics(listTopicsParams)
                        .promise();
                    for (const topic of topicsResponse.Topics) {
                        const topicArn = topic.TopicArn;
                        const arnParts = topicArn.split(":");
                        const existingTopicName = arnParts[arnParts.length - 1];
                        if (existingTopicName === topicName) {
                            return topicArn;
                        }
                    }
                    nextToken = topicsResponse.NextToken;
                } while (nextToken);
                return null;
            };
            // Extract the bookingId from the SQS message body
            const bookingId = messageBody.bookingId;

            // Retrieve booking details from DynamoDB based on bookingId
            const params = {
                TableName: "BookingsTable", // Replace with your DynamoDB table name
                Key: {
                    bookingId: bookingId,
                },
            };

            const data = await dynamoDb.get(params).promise();

            if (!data.Item) {
                throw new Error(
                    `Booking not found for bookingId: ${bookingId}`
                );
            }

            const { userId, email, userName } = data.Item;
            const topicName = `AuthTopic-${userId}`;
            const updateParams = {
                TableName: "BookingsTable", // Replace with your DynamoDB table name
                Key: {
                    bookingId: bookingId,
                },
                UpdateExpression: "set bookingStatus = :status",
                ExpressionAttributeValues: {
                    ":status": "CONFIRMED",
                },
                ReturnValues: "UPDATED_NEW",
            };

            await dynamoDb.update(updateParams).promise();

            let topicArn = await getTopicArnByName(topicName);

            // Prepare the email message
            const emailParams = {
                TopicArn: topicArn, // Replace with your SNS topic ARN
                Message: `Hello ${userName}! Your booking (ID: ${bookingId}) has been successfully created.`,
                Subject: "Booking Confirmation",
            };

            // Publish email to SNS topic
            await sns.publish(emailParams).promise();
        }

        return {
            statusCode: 200,
            body: JSON.stringify("Email notifications sent successfully"),
        };
    } catch (err) {
        console.error("Error confirming booking ", err);
        return {
            statusCode: 500,
            body: JSON.stringify(
                "Error confirmaing booking ", err
            ),
        };
    }
};
