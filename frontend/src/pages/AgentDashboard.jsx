import React, { useState } from 'react';
import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import RoomList from '../components/RoomList';
import AddRoomForm from '../components/AddRoomForm';
import { dummyRooms as initialRooms } from '../dummydata/rooms';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
    const [rooms, setRooms] = useState(initialRooms);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleAddRoom = (room) => {
        const existingRoomIndex = rooms.findIndex(r => r.id === room.id);
        if (existingRoomIndex !== -1) {
            const updatedRooms = [...rooms];
            updatedRooms[existingRoomIndex] = room;
            setRooms(updatedRooms);
        } else {
            setRooms([...rooms, room]);
        }
    };

    const handleDeleteRoom = (index) => {
        const newRooms = rooms.filter((_, i) => i !== index);
        setRooms(newRooms);
    };

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedRoom(null);
        setOpenDialog(false);
    };

    return (
      <>
      <Navbar/>
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Property Agent Dashboard</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Add New Room</Button>
                <RoomList rooms={rooms} onDelete={handleDeleteRoom} onEdit={handleEditRoom} />
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{selectedRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                    <DialogContent>
                        <AddRoomForm room={selectedRoom} onSave={handleAddRoom} onClose={handleCloseDialog} />
                    </DialogContent>
                </Dialog>
            </Box>
        </Container>
        </>
    );
};

export default AgentDashboard;
