const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'User';
const QUESTION_BANK_TABLE = 'QuestionBank';

exports.handler = async (event) => {
    const { UserID } = JSON.parse(event.body);

    const userParams = {
        TableName: USER_TABLE,
        Key: { UserID }
    };

    try {
        const userData = await dynamodb.get(userParams).promise();
        if (!userData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found.' })
            };
        }

        const { QuestionID } = userData.Item.QuestionAnswer[0];
        const questionParams = {
            TableName: QUESTION_BANK_TABLE,
            Key: { QuestionID }
        };

        const questionData = await dynamodb.get(questionParams).promise();
        if (!questionData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Question not found.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                QuestionID,
                Question: questionData.Item.Question
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
