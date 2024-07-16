export const createBooking = async (booking) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        
        });
        if(!response.ok) throw new Error('Failed to create boking');
        return response.json();
    }catch (error) {
        throw error;
    }
};