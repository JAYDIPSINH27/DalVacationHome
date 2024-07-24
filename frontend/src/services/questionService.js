export const getQuestionBank = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/questionbank`);
        if(!response.ok) throw new Error('Failed to fetch question bank');
        return response.json();
    }catch (error) {
        console.error(error);
        throw error;
    }
};