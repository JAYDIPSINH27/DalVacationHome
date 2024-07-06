import React, { useState, useContext } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { format, eachDayOfInterval } from 'date-fns';
import { toast } from 'react-toastify';
import { AuthenticationContext } from "../AuthenticationContextProvider";

const BookingModal = ({ open, onClose, roomId, startDate, endDate, setBookingDetails, disabledDates }) => {
    const { loading, userRole, userAttributesMap } = useContext(AuthenticationContext);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState(userAttributesMap.current.email);
    const [bookingError, setBookingError] = useState(null);

    const handleConfirmBooking = () => {
        if (userName && email) {
            const bookingData = {
                roomId,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                userName,
                userId:userAttributesMap.current.sub,
                arn:userAttributesMap.current["custom:sns_topic_arn"],
                email,
            };

            axios.post(import.meta.env.VITE_BOOKING_API_URL, bookingData)
                .then(response => {
                    setBookingDetails(response.data);
                    onClose(); // Close modal on successful booking
                    toast.success('Booking confirmed successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
                .catch(error => {
                    console.error('Error booking:', error);
                    setBookingError('Failed to confirm booking. Please try again.'); // Set booking error
                });
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Ensure disabledDates is initialized and is an array
    const isDateDisabled = (date) => {
        return Array.isArray(disabledDates) && disabledDates.some(disabledDate => format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    };

    // Check if any date in the range [start, end] is disabled
    const hasDisabledDatesInRange = (start, end) => {
        if (!Array.isArray(disabledDates)) {
            return false; // If disabledDates is not an array, return false
        }

        const allDatesInRange = eachDayOfInterval({ start, end });
        return allDatesInRange.some(date => isDateDisabled(date));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="user-details-modal"
            aria-describedby="modal-for-collecting-user-details"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
            }}>
                <Typography variant="h6" gutterBottom>
                    Enter Your Details
                </Typography>
                <TextField
                    label="Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={handleConfirmBooking} style={{ marginTop: '20px' }}>
                    Confirm Booking
                </Button>
                {bookingError && (
                    <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>
                        {bookingError}
                    </Typography>
                )}
            </Box>
        </Modal>
    );
}

export default BookingModal;
