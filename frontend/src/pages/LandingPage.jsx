import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Grid } from '@mui/material';
import { fetchAvailableRooms } from '../dummydata/rooms';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import RoomCard from '../components/RoomCard';
// import ChatbotDialog from '../components/ChatBot';
import ProvidedChatBot from '../components/ProvidedChatBot';
import Chatbot from '../components/Chatbot';
import withNavbar from './../utils/withNavbar';

function LandingPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchAvailableRooms()
      .then(data => {
        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch rooms. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterRooms();
  }, [startDate, endDate, guests, rooms]);

  const filterRooms = () => {
    let filtered = rooms;

    if (startDate && endDate) {
      filtered = filtered.filter(room => 
        room.availableDates.some(date => 
          new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)
        )
      );
    }

    if (guests) {
      filtered = filtered.filter(room => room.capacity >= guests);
    }

    setFilteredRooms(filtered);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom component="h1" align="center">
          Welcome to DALVacationHome
        </Typography>
        <FilterBar 
          startDate={startDate} 
          setStartDate={setStartDate} 
          endDate={endDate} 
          setEndDate={setEndDate} 
          guests={guests} 
          setGuests={setGuests} 
        />
        <Typography variant="h5" gutterBottom component="h2" align="center">
          Available Rooms
        </Typography>
        <Grid container spacing={4}>
          {filteredRooms.map(room => (
            <Grid item key={room.id} xs={12} sm={6} md={4}>
              <RoomCard room={room} />
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* <ChatbotDialog/> */}
      {/* <ProvidedChatBot/> */}
      <Chatbot/>
      
    </>
  );
}

export default withNavbar(LandingPage);
