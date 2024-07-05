const AWS = require('aws-sdk');
exports.handler = async (event) => {
    const userMessage = event.currentIntent.slots.UserMessage;
    let responseMessage = '';
    switch(userMessage.toLowerCase()) {
        case 'how do i register?':
            responseMessage = 'To register, click on the Sign-Up button on the top right corner and fill in your details.';
            break;
        case 'how do i book a room?':
            responseMessage = 'To book a room, you need to sign in first, then navigate to the Rooms section and select your preferred room.';
            break;
        case 'where can i find room tariffs?':
            responseMessage = 'Room tariffs can be found under the Rooms section. Each room type has its pricing listed.';
            break;
        case 'what are the steps to reserve a room?':
            responseMessage = 'To reserve a room, sign in, go to the Rooms section, select your room, and follow the booking process.';
            break;
        case 'how to check room availability?':
            responseMessage = 'Room availability can be checked in the Rooms section. Use the search functionality to find available rooms.';
            break;
        case 'how can i contact support?':
            responseMessage = 'You can contact support via the Contact Us page or by calling our support hotline.';
            break;
        default:
            responseMessage = 'I can assist you with registration and booking queries. How can I help you?';
    }
    return {
        dialogAction: {
            type: 'Close',
            fulfillmentState: 'Fulfilled',
            message: {
                contentType: 'PlainText',
                content: responseMessage
            }
        }
    };
};
