import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthenticationContext } from "../AuthenticationContextProvider";
import BookingModal from './BookingModal'; 
import Navbar from './Navbar';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Typography } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isWithinInterval, addDays } from 'date-fns';

function RoomDetail() {
    const { roomId } = useParams();
    const location = useLocation();
    const room1 = location.state.room;
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    const { loading: authLoading, userRole } = useContext(AuthenticationContext);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const isDateAvailable = (date) => {
        return room1.dates.some(({ StartDate, EndDate }) => {
            const start = new Date(StartDate);
            const end = new Date(EndDate);
            return isWithinInterval(date, { start, end });
        });
    };

    const handleBookNow = () => {
        if (userRole) {
            if (startDate && endDate) {
                setOpenModal(true);
            } else if (startDate) {
                alert(`Selected start date: ${format(startDate, 'MMM d')}. Please select an end date.`);
            } else {
                alert(`Please select a start date.`);
            }
        } else {
            navigate('/login');
        }
    };

    const filterDate = (date) => {
        return isDateAvailable(date);
    };

    return (
        <>
            <Navbar />
            {authLoading ? (
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Container>
            ) : !room1 ? (
                <Container sx={{ mt: 4 }}>
                    <Typography variant="h6" align="center">Room not found</Typography>
                </Container>
            ) : (
                <Container sx={{ mt: 4 }}>
                    <Card sx={{ maxWidth: 800, margin: 'auto' }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={room1.image}
                            alt={room1.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {room1.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {room1.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="div">
                                    ${room1.price} / night
                                </Typography>
                                <Button variant="contained" color="primary" disabled={!startDate || !endDate} onClick={handleBookNow}>
                                    Book Now
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Capacity: {room1.capacity} people
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Select Booking Dates:
                                </Typography>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    filterDate={filterDate}
                                />
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    {startDate && endDate ? `Selected Dates: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` :
                                        startDate ? `Selected Start Date: ${format(startDate, 'MMM d')}. Please select an end date.` :
                                            `Please select a start date.`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            )}
            <BookingModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                roomId={roomId}
                startDate={startDate}
                endDate={endDate}
                setBookingDetails={setBookingDetails}
            />
        </>
    );
}

export default RoomDetail;
