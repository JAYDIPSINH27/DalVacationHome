import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, TextField, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const sentimentColors = {
    positive: 'green',
    neutral: 'orange',
    negative: 'red',
};

function ReviewSection({ isLoggedIn }) {
    const [bookingReference, setBookingReference] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState('');
    const [email, setEmail] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isReviewAdded, setIsReviewAdded] = useState(false);

    useEffect(() => {
        // Fetch reviews from the API
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/review`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, [isReviewAdded]); // Re-fetch reviews when isReviewAdded changes

    const handleBookingReferenceSubmit = () => {
        // Here you would typically verify the booking reference
        // For this example, we'll just show the review form
        setShowReviewForm(true);
    };

    const handleReviewSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        const reviewData = {
            email: email,
            comment: newReview,
            bookingReferenceCode: bookingReference
        };

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/review`, reviewData)
            .then(response => {
                console.log('Review submitted:', response.data);
                // Toggle the isReviewAdded state to re-fetch the reviews
                setIsReviewAdded(prev => !prev);
                setNewReview('');
                setEmail('');
                setBookingReference('');
                setShowReviewForm(false);
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Reviews</Typography>
            {reviews?.map((review) => (
                <Paper key={review.userId} elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <div className='flex items-center'><Avatar sx={{ mr: 2 }}>U</Avatar>
                        <Typography variant="subtitle1">{review.userName}</Typography></div>
                        <Button variant='contained' component={Link} to="/sentiment">Check sentiment</Button>
                    </Box>
                    <Typography 
                        variant="body1" 
                        sx={{ color: sentimentColors[review.sentiment] || 'black' }}
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
                                onChange={(e) => setBookingReference(e.target.value)}
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
                        <form onSubmit={handleReviewSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                            />
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
                                type="submit"
                            >
                                Submit Review
                            </Button>
                        </form>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default ReviewSection;
