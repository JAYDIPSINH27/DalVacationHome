import React, { useContext, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthenticationContext } from "../AuthenticationContextProvider";
import BookingModal from './BookingModal';
import Navbar from './Navbar';
import ReviewSection from './ReviewSection';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Typography, Grid, Divider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isWithinInterval } from 'date-fns';
import { CalendarToday, People, AttachMoney, ExpandMore } from '@mui/icons-material';
function RoomDetail() {
    const { roomId } = useParams();
    const location = useLocation();
    const room = location.state.room;
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const { loading: authLoading, userRole } = useContext(AuthenticationContext);
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    const isDateAvailable = (date) => {
        const  yesterday = new Date();
        if (date < yesterday) return false;
        if (room.dates.length === 0) return true;
        return room.dates.some(({ StartDate, EndDate }) => {
            const start = new Date(StartDate);
            const end = new Date(EndDate);
            return isWithinInterval(date, { start, end });
        });
    };
    const handleBookNow = () => {
        if (userRole) {
            if (startDate && endDate) {
                setOpenModal(true);
            } else {
                alert('Please select both start and end dates.');
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
            ) : !room ? (
                <Container sx={{ mt: 4 }}>
                    <Typography variant="h6" align="center">Room not found</Typography>
                </Container>
            ) : (
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 400, objectFit: 'cover' }}
                                    image={room.image}
                                    alt={room.name}
                                />
                                <CardContent sx={{ p: 3 }}>
                                    <Typography gutterBottom variant="h4" component="div" sx={{ mb: 2 }}>
                                        {room.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Chip icon={<AttachMoney />} label={`$${room.price} / night`} color="primary" />
                                        <Chip icon={<People />} label={`${room.capacity} people`} />
                                    </Box>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {room.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography variant="h6">Reviews</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewSection isLoggedIn={!!userRole} room={roomId}/>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ mb: 2 }}>Book Your Stay</Typography>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Select Dates</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleDateChange}
                                                startDate={startDate}
                                                endDate={endDate}
                                                selectsRange
                                                inline
                                                filterDate={filterDate}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                                        {startDate && endDate 
                                            ? `Selected: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` 
                                            : 'Please select your dates'}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth
                                        size="large"
                                        disabled={!startDate || !endDate} 
                                        onClick={handleBookNow}
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            )}
            <BookingModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                roomId={roomId}
                startDate={startDate}
                endDate={endDate}
            />
        </>
    );
}
export default RoomDetail;