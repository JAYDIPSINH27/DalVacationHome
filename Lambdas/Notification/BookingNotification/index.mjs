import AWS from 'aws-sdk'; // AWS SDK for JavaScript

// Initialize AWS SDK
const sns = new AWS.SNS({ region: 'us-east-1' }); // Replace 'your-region' with your AWS region
const sqs = new AWS.SQS({ region: 'us-east-1' }); // Replace 'your-region' with your AWS region
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Lambda handler function
export const handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event));

        const getTopicArnByName = async (topicName) => {
            let nextToken = null;
            do {
              const listTopicsParams = {
                NextToken: nextToken,
              };
              const topicsResponse = await sns.listTopics(listTopicsParams).promise();
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

        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);

            // Extract the bookingId from the SQS message body
            const bookingId = messageBody.bookingId;

            // Retrieve booking details from DynamoDB based on bookingId
            const params = {
                TableName: 'BookingsTable', // Replace with your DynamoDB table name
                Key: {
                    bookingId: bookingId,
                },
            };

            const data = await dynamoDb.get(params).promise();

            if (!data.Item) {
                throw new Error(`Booking not found for bookingId: ${bookingId}`);
            }

            const { userId, email,userName } = data.Item;
            const topicName = `AuthTopic-${userId}`;

            let topicArn = await getTopicArnByName(topicName);
            console.log(topicName)
            console.log(topicArn)

            // Prepare the email message
            const emailParams = {
                TopicArn: topicArn, // Replace with your SNS topic ARN
                Message: `Hello ${userName}! Your booking (ID: ${bookingId}) has been successfully created.`,
                Subject: 'Booking Confirmation'
            };

            // Publish email to SNS topic
            await sns.publish(emailParams).promise();
            console.log(`Email sent to ${email} for booking ID: ${bookingId}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify('Email notifications sent successfully'),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify('Error sending email notifications'),
        };
    }
};
