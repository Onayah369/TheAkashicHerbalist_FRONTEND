import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";


function Favorites() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const getFavorites = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8888/api/favorites",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.message || "Failed to load favorites");
                }

                setFavorites(data.favorites);
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            getFavorites();
        }
    }, [token]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h1>My Favorites</h1>

            {favorites.length === 0 ? (
                <p>You haven't favorited any herbs yet.</p>
            ) : (
                <div>
                    {favorites.map((herb) => (
                        <article key={herb._id}>
                            <img
                                src={herb.image}
                                alt={herb.name}
                                width="200"
                            />
                            <h2>{herb.name}</h2>
                            <p>
                                <em>{herb.scientificName}</em>
                            </p>
                            
                            {herb.family && (
                                <p>Family: {herb.family}</p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Favorites;