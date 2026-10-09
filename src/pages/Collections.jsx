import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";

function Collections() {
    const { token } = useAuth();

    const [collections, setCollections] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [herbs, setHerbs] = useState([]);
    const [selectedHerbs, setSelectedHerbs] = useState("");

    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await fetch(
                    "https://theakashicherbalist-backend.onrender.com/api/collections",
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

                const herbResponse = await fetch(
                    "https://theakashicherbalist-backend.onrender.com/api/herbs"
                );

                const herbData = await herbResponse.json();

                if (!herbResponse.ok) {
                    throw new Error(herbData.message || "Failed to load herbs");
                }

                setHerbs(herbData.herbs || herbData);
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
                "https://theakashicherbalist-backend.onrender.com/api/collections",
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

    const handleAddHerb = async (collectionId) => {
        const herbId = selectedHerbs[collectionId];

        if (!herbId) {
            return;
        }

        try {
            const response = await fetch(
                `https://theakashicherbalist-backend.onrender.com/api/collections/${collectionId}/herbs/${herbId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add herb to collection"
                );
            }

            setCollections((currentCollections) =>
                currentCollections.map((collection) => 
                    collection._id === collectionId
                        ? data.collection
                        : collection
                )
            );

            setSelectedHerbs({
                ...selectedHerbs,
                [collectionId]: "",
            });
            setMessage("Herb added to collection.");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRemoveHerb = async (collectionId, herbId) => {
        try {
            const response = await fetch(
                `https://theakashicherbalist-backend.onrender.com/api/collections/${collectionId}/herbs/${herbId}`,
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
                    data.message || "Failed to remove herb from collection"
                );
            }

            setCollections((currentCollections) =>
                currentCollections.map((collection) =>
                    collection._id === collectionId
                        ? data.collection
                        : collection
                )
            );

            setMessage("Herb removed from collection.");
        } catch (error) { 
            setError(error.message);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        try {
            const response = await fetch(
                `https://theakashicherbalist-backend.onrender.com/api/collections/${collectionId}`,
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

            setCollections((currentCollections) =>
                currentCollections.filter(
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
            <>

            <Navbar pageTitle="Collections" />
                <main className="collections-page">
                    <div className="collections-container">

                        <div className="collections-empty">
                            <p className="collections-eyebrow">YOUR HERBAL LIBRARY</p>
                            <h1>Collections</h1>
                            <p>Please log in to view your collections.</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>

            <Navbar pageTitle="My Collections" />
            <main className="collections-page">
                <div className="collections-container">

                    <header className="collections-heading">
                        <p className="collections-eyebrow">YOUR HERBAL LIBRARY</p>
                        <h1>My Collections</h1>
                        <p>
                            Organize the herbs that speak to your journey.
                        </p>
                    </header>
                    <section className="collection-create-card">
                        <div className="collection-section-heading">
                            <p className="collections-eyebrow">CREATE</p>
                            <h2>Create a Collection</h2>
                            <p>
                                Give your collection a name and a little meaning.
                            </p>
                        </div>

                        <form 
                            className="collection-form"
                            onSubmit={handleCreateCollection}
                        >
                            <div className="collection-form-group">
                                <label htmlFor="collection-name">
                                    Collection Name
                                </label>

                                <input
                                    id="collection-name"
                                    type="text"
                                    placeholder="e.g. Evening Herbs"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="collection-form-group">
                                <label htmlFor="collection-description">
                                    Description
                                </label>
                                <textarea
                                    id="collection-description"
                                    placeholder="What is this collection about?"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="collection-primary-button"
                            >
                                Create Collection
                            </button>
                        </form>
                    </section>

                    {error && <p className="collections-error">{error}</p>}
                    {message && <p className="collections-success">{message}</p>}

                    <section className="collections-list-section">
                        <div className="collection-section-heading">
                            <p className="collections-eyebrow">YOUR COLLECTIONS</p>
                            <h2>Your Collections</h2>
                        </div>

                        {collections.length === 0 ? (
                            <div className="collections-empty">
                                <div className="collections-empty-icon">✦</div>
                                <h2>Your library is waiting.</h2>
                                <p>
                                    Create your first collection to begin organizing your favorite herbs.
                                </p>
                            </div>
                        ) : (
                            <div className="collections-grid">
                                {collections.map((collection) => (
                                    <article
                                        className="collection-card"
                                        key={collection._id}
                                    >
                                        <div className="collection-card-header">
                                            <div>
                                                <p className="collection-card-eyebrow">
                                                    HERBAL COLLECTION
                                                </p>
                                                <h3>{collection.name}</h3>
                                            </div>

                                            <span className="collection-count">
                                                {collection.herbs?.length || 0}
                                            </span>
                                        </div>

                                        {collection.description && (
                                            <p className="collection-description">
                                                {collection.description}
                                            </p>
                                        )}

                                        <div className="collection-herb-form">
                                            <label>
                                                Add an herb
                                            </label>

                                            <div className="collection-herb-controls">
                                                <select 
                                                    value={selectedHerbs[collection._id] || ""}
                                                    onChange={(event) => 
                                                        setSelectedHerbs({
                                                            ...selectedHerbs,
                                                            [collection._id]: event.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="">Select an herb</option>

                                                    {herbs.map((herb) => (
                                                        <option key={herb._id} value={herb._id}>
                                                            {herb.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    className="collection-add-button"
                                                    onClick={() => handleAddHerb(collection._id)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {collection.herbs?.length > 0 && (
                                            <div className="collection-herbs">
                                                <p className="collection-herbs-title">
                                                    Herbs in this collection
                                                </p>
                                                <ul>
                                                    {collection.herbs.map((herb) => (
                                                        <li key={herb._id}>
                                                            <span>
                                                                {herb.name}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                className="collection-remove-button"
                                                                onClick={() => 
                                                                    handleRemoveHerb(collection._id, herb._id)}
                                                            >
                                                                Remove
                                                            </button>                                        
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="collection-delete-button"
                                            onClick={() =>
                                                handleDeleteCollection(
                                                    collection._id
                                                )
                                            }
                                        >
                                            Delete Collection
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

export default Collections;