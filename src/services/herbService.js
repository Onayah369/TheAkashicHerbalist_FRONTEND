const API_URL = "http://localhost:8888/api/herbs";

export const getHerbs = async (search = "") => {
    const url = search
        ? `${API_URL}?search=${encodeURIComponent(search)}`
        : API_URL;
        
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch herbs");
    }
    return response.json();
};