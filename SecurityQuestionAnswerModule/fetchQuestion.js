const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const QUESTION_BANK_TABLE = 'QuestionBank';

exports.handler = async (event) => {
    const params = {
        TableName: QUESTION_BANK_TABLE
    };

    try {
        const data = await dynamodb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
