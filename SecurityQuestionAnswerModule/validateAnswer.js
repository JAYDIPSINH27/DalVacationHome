const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'User';

exports.handler = async (event) => {
    const { UserID, Answer } = JSON.parse(event.body);

    const params = {
        TableName: USER_TABLE,
        Key: { UserID }
    };

    try {
        const data = await dynamodb.get(params).promise();
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found.' })
            };
        }

        const storedAnswer = data.Item.QuestionAnswer[0].Answer;

        if (storedAnswer !== Answer) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid answer.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Answer validated successfully.' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
