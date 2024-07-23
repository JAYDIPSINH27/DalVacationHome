export const getRooms = async () => {
    try {
        console.log('Fetching rooms');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`);
        if (!response.ok) {
            throw new Error('Error fetching rooms, ' + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('Error fetching rooms, ' + error.message);
    }
}

export const addRoom = async (room) => {
    try {
        console.log('Adding room', room);
        const formData = new FormData();
        formData.append('name', room.name);
        formData.append('description', room.description);
        formData.append('price', room.price);
        formData.append('capacity', room.capacity);
        formData.append('image', room.image);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Error adding room, ' + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('Error adding room, ' + error.message);
    }
}

export const deleteRoom = async (room_number) => {
    try {
        console.log('Deleting room', room_number);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
            method: 'DELETE',
            body: JSON.stringify({ room_number }),
        });
        if (!response.ok) {
            throw new Error('Error deleting room, ' + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('Error deleting room, ' + error.message);
    }
}

export const updateRoom = async (room) => {
    try {
        console.log('Updating room', room);
        const formData = new FormData();
        formData.append('room_number', room.room_number);
        formData.append('name', room.name);
        formData.append('description', room.description);
        formData.append('price', room.price);
        formData.append('capacity', room.capacity);
        formData.append('image', room.image);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Error updating room, ' + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('Error updating room, ' + error.message);
    }
}