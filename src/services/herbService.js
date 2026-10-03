const API_URL = "http://localhost:8888/api/herbs";

export const getHerbs = async () => {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
        throw new Error("Failed to fetch herbs");
    }
    return response.json();
};