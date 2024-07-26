import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);

export const handler = async (event) => {
  // Log the incoming event for debugging purposes
  console.log(event);

  // Extract the booking ID from the slots
  const bookingId = event.currentIntent.slots.BookingReferenceCode;

  // Extract the session attributes from the event
  const sessionAttributes = event.sessionAttributes || {};
  const userRole = sessionAttributes.userRole || 'unknown';  // Default to 'unknown' if userRole is not provided
  const userId = event.userId || 'unknown';  // Default to 'unknown' if userId is not provided

  // Check if userRole or userId is unknown and respond accordingly
  if (userRole === 'unknown' || userId === 'unknown') {
    return {
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          contentType: 'PlainText',
          content: 'You need to log in first.',
        },
      },
    };
  }

  // Fetch data from DynamoDB for the given booking ID
  const params = {
    TableName: 'BookingsTable',
    Key: { bookingId: bookingId },
  };

  try {
    const command = new GetCommand(params);
    const result = await dynamoDb.send(command);
    
    if (!result.Item) {
      return {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: `No booking found for ID ${bookingId}.`,
          },
        },
      };
    }

    const booking = result.Item;
    const responseContent = `Booking Details:
    - Booking ID: ${booking.bookingId}
    - User Name: ${booking.userName}
    - Email: ${booking.email}
    - Room ID: ${booking.roomId}
    - Start Date: ${booking.startDate}
    - End Date: ${booking.endDate}
    - Booking Status: ${booking.bookingStatus}
    - Created At: ${booking.createdAt}`;

    return {
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          contentType: 'PlainText',
          content: responseContent,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching booking data from DynamoDB:', error);
    return {
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Failed',
        message: {
          contentType: 'PlainText',
          content: 'An error occurred while fetching your booking details. Please try again later.',
        },
      },
    };
  }
};
