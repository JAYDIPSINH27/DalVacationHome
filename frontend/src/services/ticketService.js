export const createTicket = async ({
    bookingId,
    message,
    user_id
}) => {
    try {
        const ticket = {
            query: message,
            bookingId,
            user_id,
        }
        const response = await fetch(`https://us-central1-csci-5410-serverless-project.cloudfunctions.net/create-ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket),
        
        });
        if(!response.ok) throw new Error('Failed to create ticket');
        return response.json();
    }catch (error) {
        throw error;
    }
}

export const getTickets = async ({
    userId,
    role
}) => {
    try {
        const response = await fetch(`https://us-central1-csci-5410-serverless-project.cloudfunctions.net/get-user-tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId, role}),
        });
        if(!response.ok) throw new Error('Failed to get tickets');
        return response.json();
    }catch (error) {
        throw error;
    }
}

export const sendMessage = async ({
    ticketId,
    message,
    senderType,
    sender,
}) => {
    try {
        const response = await fetch(`https://us-central1-csci-5410-serverless-project.cloudfunctions.net/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ticketId, message, senderType, sender}),
        });
        if(!response.ok) throw new Error('Failed to send message');
        return response.json();
    }catch (error) {
        throw error;
    }
}