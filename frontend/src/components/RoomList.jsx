import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const RoomList = ({ rooms, onDelete, onEdit }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Room List</Typography>
            <List>
                {rooms.map((room, index) => (
                    <ListItem key={index} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(room)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemText primary={room.name} secondary={`Price: $${room.price} / night`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RoomList;
