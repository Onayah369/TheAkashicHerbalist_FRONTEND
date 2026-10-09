const API_URL = "https://theakashicherbalist-backend.onrender.com/api/herbs";

export const getHerbs = async (
    search = "", 
    sort = "",
    usage = "",
    continent = "",
    country = ""
) => {
    const params = new URLSearchParams();
    if (search) {
        params.append("search", search);
    }
    if (sort) {
        params.append("sort", sort);
    }
    if (usage) {
        params.append("usage", usage);
    }
    if (continent) {
        params.append("continent", continent)
    }
    if (country) {
        params.append("country", country);
    }

    const queryString = params.toString();

    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch herbs");
    }
    return response.json();
};