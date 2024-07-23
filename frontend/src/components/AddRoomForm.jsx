import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const AddRoomForm = ({ room, onSave, onClose }) => {
    const [name, setName] = useState("");
    const [room_number, setRoomNumber] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (room) {
            setName(room.name);
            setDescription(room.description);
            setPrice(room.price);
            setCapacity(room.capacity);
            setRoomNumber(room.room_number);
        }
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave({ name, description, price, capacity, image, room_number });
        onClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Room Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
                required
            />
            <TextField
                label="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
                required
            />
            <div>
                <label>Room Image</label><br />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files)}
                />
            </div>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
            >
                {room ? "Save Changes" : "Add Room"}
            </Button>
        </Box>
    );
};

export default AddRoomForm;
