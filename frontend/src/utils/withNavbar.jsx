import React from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import { Box } from '@mui/material';

const withNavbar = (WrappedComponent) => {
    return (props) => (
        <Box>
            <Navbar />
            <Box sx={{ padding: 3 }}>
                <WrappedComponent {...props} />
            </Box>

        </Box>
    );
};

export default withNavbar;
