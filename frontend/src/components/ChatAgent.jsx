import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const ChatAgent = () => {
    const [bookingReference, setBookingReference] = useState('');

    const handleAnswerQuery = () => {
        // Logic to answer client query with bookingReference
        console.log('Answering query for booking reference:', bookingReference);
        // Implement your answer logic here
    };

    return (
        <div>
            <TextField
                label="Enter Booking Reference"
                value={bookingReference}
                onChange={(e) => setBookingReference(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAnswerQuery}>
                Answer Query
            </Button>
        </div>
    );
};

export default ChatAgent;
