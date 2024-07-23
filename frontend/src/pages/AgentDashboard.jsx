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
} from "@mui/material";
import RoomList from "../components/RoomList";
import AddRoomForm from "../components/AddRoomForm";
import Navbar from "../components/Navbar";
import useRooms from "../hooks/useRooms";
import { toast } from "react-toastify";

const AgentDashboard = () => {
    const { rooms, addRoomMutation, deleteRoomMutation, updateRoomMutation } = useRooms();
    console.log(rooms);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleAddRoom = async (room) => {
        const roomData = {
            name: room.name,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            image: room.image[0],
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
        console.log("Edit action", room);
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
        console.log("Edit room", room);
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
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Property Agent Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                    >
                        Add New Room
                    </Button>
                    <RoomList
                        rooms={rooms}
                        onDelete={handleDeleteRoom}
                        onEdit={handleEditRoom}
                    />
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>
                            {selectedRoom ? "Edit Room" : "Add New Room"}
                        </DialogTitle>
                        <DialogContent>
                            <AddRoomForm
                                room={selectedRoom}
                                onSave={
                                    selectedRoom
                                        ? handleEditAction
                                        : handleAddRoom
                                }
                                onClose={handleCloseDialog}
                            />
                        </DialogContent>
                    </Dialog>
                </Box>
            </Container>
        </>
    );
};

export default AgentDashboard;
