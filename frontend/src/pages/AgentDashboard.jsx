import React, { useState } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RoomList from "../components/RoomList";
import AddRoomForm from "../components/AddRoomForm";
import Navbar from "../components/Navbar";
import useRooms from "../hooks/useRooms";
import { toast } from "react-toastify";
import Chatbot from "../components/Chatbot";


const AgentDashboard = () => {
    const { rooms, addRoomMutation, deleteRoomMutation, updateRoomMutation } = useRooms();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => {
        setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 0.5));
    };

    const handleAddRoom = async (room) => {
        console.log("form", room.formRef.current[10].files[0])
        const roomData = {
            name: room.name,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            image: room.formRef.current[10].files[0],
            type: room.type,
        };
        try {
            await addRoomMutation.mutateAsync(roomData);
            toast.success("Room added successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditAction = async (room) => {
        const roomData = {
            room_number: room.room_number,
            name: room.name,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            image: room.image[0],
            type: room.type,
        };
        try {
            await updateRoomMutation.mutateAsync(roomData);
            toast.success("Room updated successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteRoom = async (room_number) => {
        try {
            await deleteRoomMutation.mutateAsync(room_number);
            toast.success("Room deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
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
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Property Agent Dashboard
                </Typography>
                <Grid container spacing={4}>

                    <Grid item xs={12} md={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                            sx={{ mb: 2 }}
                        >
                            Add New Room
                        </Button>
                        <RoomList
                            rooms={rooms}
                            onDelete={handleDeleteRoom}
                            onEdit={handleEditRoom}
                        />
                    </Grid>
                </Grid>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                        {selectedRoom ? "Edit Room" : "Add New Room"}
                    </DialogTitle>
                    <DialogContent>
                        <AddRoomForm
                            room={selectedRoom}
                            onSave={selectedRoom ? handleEditAction : handleAddRoom}
                            onClose={handleCloseDialog}
                        />
                    </DialogContent>
                </Dialog>
                <Chatbot />
            </Container>
        </>
    );
};

export default AgentDashboard;
