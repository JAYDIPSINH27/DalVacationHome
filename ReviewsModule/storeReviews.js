// postReview.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'User';

exports.handler = async (event) => {
    const { user_id, room_id, comment } = JSON.parse(event.body);

    const getUserParams = {
        TableName: USER_TABLE,
        Key: { UserID: user_id }
    };

    try {
        const data = await dynamodb.get(getUserParams).promise();

        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found.' }),
            };
        }

        const reviews = data.Item.reviews || [];
        reviews.push({ room_id, comment });

        const updateUserParams = {
            TableName: USER_TABLE,
            Key: { UserID: user_id },
            UpdateExpression: 'set reviews = :reviews',
            ExpressionAttributeValues: {
                ':reviews': reviews
            }
        };

        await dynamodb.update(updateUserParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Review added successfully.' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
