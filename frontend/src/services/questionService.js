export const getQuestionBank = async () => {
    try {
        const response = await fetch('https://wzlmfthjp7oi2erzbi3ppt6uma0xentc.lambda-url.us-east-1.on.aws/');
        if(!response.ok) throw new Error('Failed to fetch question bank');
        return response.json();
    }catch (error) {
        console.error(error);
        throw error;
    }
};