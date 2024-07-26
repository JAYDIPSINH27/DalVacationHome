// Import necessary modules
import fetch from 'node-fetch'; // Ensure node-fetch is included in your Lambda deployment package

export const handler = async (event) => {
  // Log the incoming event for debugging purposes
  console.log(event);

  // Extract the booking ID from the slots
  const bookingId = event.currentIntent.slots.BookingReferenceCode;

  // Extract the session attributes from the event
  const sessionAttributes = event.sessionAttributes || {};
  const userRole = sessionAttributes.userRole || 'unknown';  // Default to 'unknown' if userRole is not provided
  const userId = event.userId || 'unknown';  // Default to 'unknown' if userId is not provided

  const userMessage = event.inputTranscript;

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

  try {
    const ticket = await createTicket({
      bookingId: bookingId,
      message: userMessage,
      user_id: userId
    });

    const responseMessage = `Your concern has been logged. A ticket has been created with ID: ${ticket.data.ticketId}.` +
      `<a href="/ticket/${ticket.data.ticketId}/" onclick="openChatWindow()">Click here to chat with an agent</a>`;

    return {
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          contentType: 'PlainText',
          content: responseMessage,
        },
      },
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return {
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Failed',
        message: {
          contentType: 'PlainText',
          content: 'An error occurred while processing your concern. Please try again later.',
        },
      },
    };
  }
};

const createTicket = async ({ bookingId, message, user_id }) => {
  try {
    const ticket = {
      query: message,
      bookingId,
      user_id,
    };
    const response = await fetch(`https://us-central1-csci-5410-serverless-project.cloudfunctions.net/create-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });

    if (!response.ok) throw new Error('Failed to create ticket');

    const responseData = await response.json(); // Read and parse the response body once
    return responseData;
  } catch (error) {
    throw error;
  }
};
