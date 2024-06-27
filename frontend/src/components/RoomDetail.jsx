import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to access route parameters
import { Container, Card, CardContent, CardMedia, Typography, Box, Button, CircularProgress } from '@mui/material';
import { format, isSameDay } from 'date-fns'; // Import date-fns functions

// Import dummy data and fetch function
import { fetchAvailableRooms } from '../dummydata/rooms';
import Navbar from './Navbar';

function RoomDetail() {
    const { roomId } = useParams(); // Get room ID from route parameters
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);
    const [startDate, setStartDate] = useState(null); // State to manage start date
    const [endDate, setEndDate] = useState(null); // State to manage end date

    useEffect(() => {
        // Simulate loading delay
        fetchAvailableRooms().then((rooms) => {
            const selectedRoom = rooms.find(room => room.id === roomId); // Find room by ID
            setRoom(selectedRoom);
            setLoading(false);
        });
    }, [roomId]); // Reload room details when roomId changes

    const handleDateClick = (date) => {
        if (!startDate || (startDate && endDate)) {
            // Select start date if no start date is selected or both dates are selected
            setStartDate(date);
            setEndDate(null); // Clear end date if selecting a new start date
        } else if (startDate && !endDate && date >= startDate) {
            // Select end date if only start date is selected and date is after or equal to start date
            setEndDate(date);
        } else if (startDate && endDate && date < startDate) {
            // Change start date if both start and end dates are selected and date is before start date
            setStartDate(date);
        }
    };

    const handleReset = () => {
        // Clear both start and end dates
        setStartDate(null);
        setEndDate(null);
    };

    const handleBookNow = () => {
        // Simulate booking action
        if (startDate && endDate) {
            alert(`Booked for dates: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`);
        } else if (startDate) {
            alert(`Selected start date: ${format(startDate, 'MMM d')}. Please select an end date.`);
        } else {
            alert(`Please select a start date.`);
        }
    };

    const todayFormatted = new Date(); // Today's date

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
                        image={room.imageUrl} // Use room image URL
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
                        {/* Display available dates */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            {room.availableDates.map((dateString, index) => {
                                const date = new Date(dateString);
                                const isDisabled = date.getTime() <= todayFormatted.getTime(); // Disable past dates
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
        </>
    );
}

export default RoomDetail;
