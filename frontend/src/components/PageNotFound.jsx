import React from 'react';
import { Container, Typography } from '@mui/material';

const PageNotFound = () => {

    const imageUrl = 'https://i.imgur.com/qIufhof.png';

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div>
                <img src={imageUrl} alt="Page Not Found" style={{ maxWidth: '100%', height: 'auto' }} />
                <Typography variant="h5" align="center" mt={4}>
                    Oops! Page not found.
                </Typography>
            </div>
        </Container>
    );
};

export default PageNotFound;
