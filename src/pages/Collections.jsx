import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Collections() {
    const { token } = useAuth();

    const [collections, setCollections] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8888/api/collections",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load collections"
                    );
                }

                setCollections(data.collections);
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            getCollections();
        }
    }, [token]);

    const handleCreateCollection = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:8888/api/collections",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        description,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create collection"
                );
            }

            setCollections([...collections, data.collection]);
            setName("");
            setDescription("");
            setMessage("Collection created successfully.");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        try {
            const response = await fetch(
                `http://localhost:8888/api/collections/${collectionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete collection"
                );
            }

            setCollections(
                collections.filter(
                    (collection) => collection._id !== collectionId
                )
            );

            setMessage("Collection deleted successfully.");
        } catch (error) {
            setError(error.message);
        }
    };

    if (!token) {
        return (
            <main>
                <Link to="/">← Back to Home</Link>
                <h1>Collections</h1>
                <p>Please log in to view your collections.</p>
            </main>
        );
    }

    return (
        <main>
            <Link to="/">← Back to Home</Link>
            <h1>My Collections</h1>

            <section>
                <h2>Create a Collection</h2>

                <form onSubmit={handleCreateCollection}>
                    <input
                        type="text"
                        placeholder="Collection name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />

                    <button type="submit">
                        Create Collection
                    </button>
                </form>
            </section>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <section>
                <h2>Your Collections</h2>

                {collections.length === 0 ? (
                    <p>You haven't created any collections yet.</p>
                ) : (
                    collections.map((collection) => (
                        <article key={collection._id}>
                            <h3>{collection.name}</h3>

                            {collection.description && (
                                <p>{collection.description}</p>
                            )}

                            <p>
                                {collection.herbs?.length || 0} herbs
                            </p>

                            <button
                                onClick={() =>
                                    handleDeleteCollection(
                                        collection._id
                                    )
                                }
                            >
                                Delete Collection
                            </button>
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}

export default Collections;