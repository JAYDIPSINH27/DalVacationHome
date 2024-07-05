import React, { useState } from 'react'
import ChatWindow from './ChatWindow'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import withNavbar from '../utils/withNavbar';
const ChatClient = () => {
    const [openChat, setOpenChat] = useState(false);
    const [bookingReference, setBookingReference] = useState('');
    const [showBookingReferenceDialog, setShowBookingReferenceDialog] = useState(false);

    const handleChatClick = () => {
        setShowBookingReferenceDialog(true);
    };

    const handleChatClose = () => {
        setOpenChat(false);
    };

    const handleBookingReferenceSubmit = () => {
        if (bookingReference.trim()) {
            setShowBookingReferenceDialog(false);
            setOpenChat(true);
        }
    };

    return (
        <>
            {/* <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignContent:"center", }}> */}
                {/* <h1>Get the Agent Support</h1> */}
                <Button variant="contained" color="primary" onClick={handleChatClick}>
                    Chat with Agent
                </Button>
            {/* </Box> */}

            <Dialog open={showBookingReferenceDialog} onClose={() => setShowBookingReferenceDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Enter Booking Reference</DialogTitle>
                <DialogContent>
                    <TextField
                        value={bookingReference}
                        onChange={(e) => setBookingReference(e.target.value)}
                        fullWidth
                        placeholder="Booking Reference"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBookingReferenceDialog(false)}>Cancel</Button>
                    <Button onClick={handleBookingReferenceSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <ChatWindow open={openChat} onClose={handleChatClose} bookingReference={bookingReference} />
        </>
    );
};

export default withNavbar(ChatClient);