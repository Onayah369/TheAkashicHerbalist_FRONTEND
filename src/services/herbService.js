const API_URL = "http://localhost:8888/api/herbs";

export const getHerbs = async (search = "", sort = "") => {
    const params = new URLSearchParams();
    if (search) {
        params.append("search", search);
    }
    if (sort) {
        params.append("sort", sort);
    }

    const queryString = params.toString();

    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch herbs");
    }
    return response.json();
};