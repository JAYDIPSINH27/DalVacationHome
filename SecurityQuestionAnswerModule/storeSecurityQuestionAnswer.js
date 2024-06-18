const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'User';

exports.handler = async (event) => {
    const { UserID, QuestionID, Answer } = JSON.parse(event.body);

    const params = {
        TableName: USER_TABLE,
        Item: {
            UserID,
            QuestionAnswer: [
                {
                    QuestionID,
                    Answer
                }
            ]
        }
    };

    try {
        await dynamodb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Security question and answer stored successfully.' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
