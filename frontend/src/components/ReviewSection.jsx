import React, { useState } from 'react';
import { Box, Typography, Avatar, TextField, Button, Paper, Divider } from '@mui/material';

const dummyReviews = [
    { id: 1, user: 'John D.', comment: 'Great room, loved the view!', sentiment: 'positive' },
    { id: 2, user: 'Sarah M.', comment: 'Decent stay, but a bit noisy.', sentiment: 'neutral' },
    { id: 3, user: 'Mike R.', comment: 'Disappointing experience overall.', sentiment: 'negative' },
];

const sentimentColors = {
    positive: 'green',
    neutral: 'orange',
    negative: 'red',
};

function ReviewSection({ isLoggedIn }) {
    const [bookingReference, setBookingReference] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState('');

    const handleBookingReferenceSubmit = () => {
        // Here you would typically verify the booking reference
        // For this example, we'll just show the review form
        setShowReviewForm(true);
    };

    const handleReviewSubmit = () => {
        // Here you would typically submit the review to your backend
        console.log('Submitted review:', newReview);
        setNewReview('');
        setShowReviewForm(false);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Reviews</Typography>
            {dummyReviews.map((review) => (
                <Paper key={review.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2 }}>{review.user[0]}</Avatar>
                        <Typography variant="subtitle1">{review.user}</Typography>
                    </Box>
                    <Typography 
                        variant="body1" 
                        sx={{ color: sentimentColors[review.sentiment] }}
                    >
                        {review.comment}
                    </Typography>
                </Paper>
            ))}
            
            {isLoggedIn && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Add Your Review</Typography>
                    {!showReviewForm ? (
                        <Box>
                            <TextField
                                fullWidth
                                label="Booking Reference"
                                value={bookingReference}
                                onChange={(e) => setBookingReference(e.target.e)}
                                sx={{ mb: 2 }}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleBookingReferenceSubmit}
                            >
                                Verify Booking
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Your Review"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleReviewSubmit}
                            >
                                Submit Review
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default ReviewSection;