import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

const AddRoomForm = ({ room, onSave, onClose }) => {
    const [name, setName] = useState("");
    const [room_number, setRoomNumber] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [type, setType] = useState("room");
    const [image, setImage] = useState("");
    const formRef = React.createRef();

    useEffect(() => {
        if (room) {
            setName(room.name);
            setDescription(room.description);
            setPrice(room.price);
            setCapacity(room.capacity);
            setType(room.type);
            setRoomNumber(room.room_number);
        }
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave({
            name,
            description,
            price,
            capacity,
            image,
            room_number,
            type,
            formRef
        });
        onClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} ref={formRef}>
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
            <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Type</InputLabel>
                <Select labelId="type-label" id="type-select" label="Type" value={type} onChange={(e)=>{setType(e.target.value)}}>
                    <MenuItem value="room">Room</MenuItem>
                    <MenuItem value="rec_room">Rec Room</MenuItem>
                </Select>
            </FormControl>
            <div>
                <label>Room Image</label>
                <br />
                <input
                    id="image"
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
