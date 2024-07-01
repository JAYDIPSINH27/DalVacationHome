import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ProvidedChatBot = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
            <Fab color="primary" onClick={handleClickOpen}>
                <ChatIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Chat with us</DialogTitle>
                <iframe height="430" width="350" src="https://bot.dialogflow.com/e36509a1-b767-484b-8a95-d3bf1f808106"></iframe>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProvidedChatBot;
