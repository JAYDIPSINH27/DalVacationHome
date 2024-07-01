import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, CardMedia, Typography, Box, Button, CircularProgress, Chip, Modal, TextField } from '@mui/material';
import { format, isSameDay } from 'date-fns';
import { fetchAvailableRooms } from '../dummydata/rooms';
import Navbar from './Navbar';
import BookingModal from './BookingModal'; // Import the new BookingModal component
import axios from 'axios'; // Import Axios for HTTP requests

function RoomDetail() {
    const { roomId } = useParams();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        fetchAvailableRooms().then((rooms) => {
            const selectedRoom = rooms.find(room => room.id === roomId);
            setRoom(selectedRoom);
            setLoading(false);
        });
    }, [roomId]);

    const handleDateClick = (date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate && date >= startDate) {
            setEndDate(date);
        } else if (startDate && endDate && date < startDate) {
            setStartDate(date);
        }
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const handleBookNow = () => {
        if (startDate && endDate) {
            setOpenModal(true);
        } else if (startDate) {
            alert(`Selected start date: ${format(startDate, 'MMM d')}. Please select an end date.`);
        } else {
            alert(`Please select a start date.`);
        }
    };

    const todayFormatted = new Date();

    return (
        <>
            <Navbar />
            {loading ? (
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Container>
            ) : !room ? (
                <Typography variant="h6">Room not found</Typography>
            ) : (
                <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
                    <CardMedia
                        component="img"
                        height="400"
                        image={room.imageUrl}
                        alt={room.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {room.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {room.description}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="div">
                                ${room.price} / night
                            </Typography>
                            <Button variant="contained" color="primary" disabled={!startDate || !endDate} onClick={handleBookNow}>
                                Book Now
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                        <Typography sx={{ mt: 2 }}>
                            Capacity: {room.capacity} people
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mt: 2, mb: 2 }}>
                                Amenities:
                            </Typography>
                            {room.amenities.map((amenity, index) => (
                                <Chip key={index} label={amenity} style={{ margin: '2px' }} />
                            ))}
                        </Box>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            {room.availableDates.map((dateString, index) => {
                                const date = new Date(dateString);
                                const isDisabled = date.getTime() <= todayFormatted.getTime();
                                const isSelected = startDate && isSameDay(date, startDate);
                                const isInRange = startDate && endDate && date >= startDate && date <= endDate;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        disabled={isDisabled || (startDate && endDate && !isInRange)}
                                        style={{
                                            margin: '5px',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            backgroundColor: isInRange || isSelected ? '#4caf50' : isDisabled ? '#f0f0f0' : 'transparent',
                                            color: isInRange || isSelected ? 'white' : isSelected ? 'white' : isDisabled ? 'rgba(0, 0, 0, 0.38)' : 'inherit',
                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {format(date, 'MMM d')}
                                    </button>
                                );
                            })}
                        </div>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {startDate && endDate ? `Selected Dates: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` :
                                startDate ? `Selected Start Date: ${format(startDate, 'MMM d')}. Please select an end date.` :
                                    `Please select a start date.`}
                        </Typography>
                    </CardContent>
                </Card>
            )}
            {/* Modal for collecting user details */}
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
