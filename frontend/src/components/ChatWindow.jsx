import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const ChatWindow = ({ open, onClose, bookingReference }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'customer', text: newMessage }]);
            setNewMessage('');
            // Add logic to send message to agent
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chat with Agent</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">Booking Reference: {bookingReference}</Typography>
                <Box sx={{ height: '300px', overflowY: 'auto', mb: 2 }}>
                    {messages.map((message, index) => (
                        <Typography key={index} align={message.sender === 'customer' ? 'right' : 'left'} sx={{ mb: 1 }}>
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: message.sender === 'customer' ? '#3f51b5' : '#e0e0e0',
                                    color: message.sender === 'customer' ? 'white' : 'black',
                                }}
                            >
                                {message.text}
                            </Box>
                        </Typography>
                    ))}
                </Box>
                <TextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSendMessage} color="primary" variant="contained">
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatWindow;