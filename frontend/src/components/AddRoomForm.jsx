import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';

const AddRoomForm = ({ room, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (room) {
            setName(room.name);
            setDescription(room.description);
            setPrice(room.price);
            setCapacity(room.capacity);
            setImageUrl(room.imageUrl);
            setStartDate(new Date(room.availableDates[0]));
            setEndDate(new Date(room.availableDates[room.availableDates.length - 1]));
        }
    }, [room]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = room ? room.id : Date.now().toString();
        const availableDates = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            availableDates.push(currentDate.toISOString().split('T')[0]);
            currentDate = addDays(currentDate, 1);
        }
        onSave({ id, name, description, price, capacity, imageUrl, availableDates });
        onClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>{room ? 'Edit Room' : 'Add New Room'}</Typography>
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
            <TextField
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Available Dates</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>{room ? 'Save Changes' : 'Add Room'}</Button>
        </Box>
    );
};

export default AddRoomForm;
