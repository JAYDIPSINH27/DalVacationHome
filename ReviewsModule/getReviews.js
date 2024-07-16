// getReviews.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'User';

exports.handler = async (event) => {
    const { room_id } = JSON.parse(event.body);

    const params = {
        TableName: USER_TABLE
    };

    try {
        const data = await dynamodb.scan(params).promise();
        const reviews = [];

        data.Items.forEach(user => {
            if (user.reviews) {
                user.reviews.forEach(review => {
                    if (review.room_id === room_id) {
                        reviews.push({
                            user_id: user.UserID,
                            comment: review.comment
                        });
                    }
                });
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(reviews),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
