import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


function Favorites() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);

            }
        };

        if (token) {
            getFavorites();
        } else {
            setLoading(false);
        }
    }, [token]);

    const removeFavorite = async (herbId) => {
        try {
            const response = await fetch(
                `http://localhost:8888/api/favorites/${herbId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                );

                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.message || "Failed to remove favorite");
                }

                setFavorites((currentFavorites) =>
                    currentFavorites.filter((herb) => herb._id !== herbId)
                );
            } catch (error) {
                setError(error.message);
            }
        };

        if (!token) {
            return (
                <>

                    <Navbar pageTitle="My Favorites" />

                    <main className="favorites-page">
                        <section className="favorites-card favorites-empty">
                            <p className="favorites-eyebrow">YOUR HERBAL COLLECTION</p>
                            <h1>Login Required</h1>
                            <p>
                                Please log in to view your favorite herbs.
                            </p>

                            <button 
                                className="favorites-primary-button"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </section>
                    </main>
                </>
            );
        }

        if (loading) {
            return (
                <>
                    <Navbar pageTitle="My Favorites" />

                    <main className="favorites-page">
                        <p className="favorites-status">Loading favorites...</p>
                    </main>
                </>
            );
        }

    return (
        <>
            <Navbar pageTitle="My Favorites" />
            
            <main className="favorites-page">
                <section className="favorites-container">
        
                    <header className="favorites-heading">
                        <p className="favorites-eyebrow">
                            YOUR HERBAL COLLECTION
                        </p>
                        <h1>My Favorites</h1>
                        <p>
                            Keep the herbs that speak to you close.
                        </p>
                    </header>

                    {error && (
                        <p className="favorites-error">{error}</p>
                    )}

                    {favorites.length === 0 ? (
                        <section className="favorites-empty">
                            <div className="favorites-empty-icon">♡</div>
                            <h2>No favorites yet</h2>
                            <p>
                                Explore the herbal library and save the herbs you want to return to.
                            </p>

                            <button
                                className="favorites-primary-button"
                                onClick={() => navigate("/")}
                            >
                                Explore Herbs
                            </button>
                        </section>
                    ) : (
                        <div className="favorites-grid">
                            {favorites.map((herb) => (
                                <article 
                                    className="favorite-herb-card"
                                    key={herb._id}
                                >
                                    <div className="favorite-herb-image">
                                        {herb.image ? (
                                            <img
                                                src={herb.image}
                                                alt={herb.name}
                                            />
                                        ) : (
                                            <div className="favorite-no-image">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="favorite-herb-content">
                                        <p className="favorite-herb-eyebrow">
                                            HERB
                                        </p>

                                        <h2>{herb.name}</h2>

                                        {herb.scientificName && (
                                            <p className="favorite-scientific-name">
                                                <em>{herb.scientificName}</em>
                                            </p>
                                        )}
                                        {herb.family && (
                                            <p className="favorite-family">Family: {herb.family}</p>
                                        )}

                                        <button
                                            type="button"
                                            className="favorite-remove-button"
                                            onClick={() => removeFavorite(herb._id)}
                                        >
                                            ♡ Remove Favorite
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default Favorites;