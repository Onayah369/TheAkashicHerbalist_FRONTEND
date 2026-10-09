import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";

function Journal() {
    const { token } = useAuth();
    
    const [entries, setEntries] = useState([]);
    const [herbs, setHerbs] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedHerb, setSelectedHerb] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadJournal = async () => {
            try {
                const response = await fetch(
                    "https://theakashicherbalist-backend.onrender.com/api/journal",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load journal entries"
                    );
                }

                setEntries(data.entries);

                const herbResponse = await fetch(
                    "https://theakashicherbalist-backend.onrender.com/api/herbs"
                );

                const herbData = await herbResponse.json();

                if (!herbResponse.ok) {
                    throw new Error(
                        herbData.message || "Failed to load herbs"
                    );
                }

                setHerbs(herbData.herbs || herbData);
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            loadJournal();
        }
    }, [token]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setSelectedHerb("");
        setIsPublic(false);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const url = editingId
            ? `https://theakashicherbalist-backend.onrender.com/api/journal/${editingId}`
            : "https://theakashicherbalist-backend.onrender.com/api/journal";

        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    herb: selectedHerb,
                    isPublic,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save journal entry"
                );
            }

            if (editingId) {
                setEntries((currentEntries) =>
                    currentEntries.map((entry) =>
                        entry._id === editingId ? data.entry : entry
                    )
                );
                setMessage("Journal entry updated successfully.");
            } else {
                setEntries((currentEntries) => [data.entry, ...currentEntries]);
                setMessage("Journal entry created successfully.");
            }

            resetForm();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (entry) => {
        setEditingId(entry._id);
        setTitle(entry.title);
        setContent(entry.content);
        setSelectedHerb(entry.herb?._id || "");
        setIsPublic(entry.isPublic);
        setError("");
        setMessage("");
    };

    const handleDelete = async (entryId) => {
        try {
            const response = await fetch(
                `https://theakashicherbalist-backend.onrender.com/api/journal/${entryId}`,
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
                    data.message || "Failed to delete journal entry"
                );
            }

            setEntries((currentEntries) =>
                currentEntries.filter((entry) => entry._id !== entryId)
            );

            setMessage("Journal entry deleted successfully.");
        } catch (error) {
            setError(error.message);
        }
    };

    if (!token) {
        return (
            <>

                <Navbar pageTitle="Journal" />
                <main className="journal-page">
                    <div className="journal-container">

                    <div className="journal-empty">
                        <h1>My Journal</h1>
                        <p>Please log in to view your journal.</p>
                    </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>

            <Navbar pageTitle="My Journal" />
            <main className="journal-page">
                <div className="journal-container">
                    
                    <header className="journal-heading">
                        <p className="journal-eyebrow">YOUR HERBAL JOURNEY</p>
                        <h1>My Journal</h1>
                        <p>
                            Reflect on the herbs, experiences, and discoveries that become part of your journey.
                        </p>
                    </header>

                    <section className="journal-create-card">
                        <div className="journal-section-heading">
                            <p className="journal-eyebrow">
                                {editingId ? "EDIT ENTRY" : "CREATE"}
                            </p>
                            <h2>
                                {editingId ? "Edit Journal Entry" : "New Journal Entry"}
                            </h2>
                            <p>
                                Record your thoughts, experiences, and herbal observations.
                            </p>
                        </div>

                        <form
                            className="journal-form"
                            onSubmit={handleSubmit}>
                                <div className="journal-form-group">
                                    <label htmlFor="journal-title">
                                        Entry Title
                                    </label>

                                    <input
                                        id="journal-title"
                                        type="text"
                                        placeholder="e.g. My experience with lavender"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        required
                                    />
                                </div>

                                <div className="journal-form-group">
                                    <label htmlFor="journal-herb">
                                        Herb
                                    </label>
                                    <select
                                        value={selectedHerb}
                                        onChange={(event) =>
                                            setSelectedHerb(event.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select an herb</option>

                                        {herbs.map((herb) => (
                                            <option key={herb._id} value={herb._id}>
                                                {herb.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="journal-form-group">
                                    <label htmlFor="journal-content">
                                        Your Entry
                                    </label>

                                    <textarea
                                        placeholder="Write your journal entry..."
                                        value={content}
                                        onChange={(event) =>
                                            setContent(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                            <label className="journal-public-toggle">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(event) =>
                                        setIsPublic(event.target.checked)
                                    }
                                />
                                <span>
                                    Make this entry public
                                </span>
                            </label>

                            <div className="journal-form-actions">
                                <button 
                                    type="submit"
                                    className="journal-primary-button"
                                >
                                {editingId ? "Update Entry" : "Create Entry"}
                            </button>

                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className="journal-cancel-button"
                                >
                                    Cancel Edit
                                </button>
                            )}
                            </div>
                        </form>
                    </section>

                    {error && <p className="journal-error">{error}</p>}
                    {message && <p className="journal-success">{message}</p>}

                    <section className="journal-list-section">
                        <div className="journal-section-heading">
                            <p className="journal-eyebrow">
                                YOUR ENTRIES
                            </p>
                            <h2>Your Journal Entries</h2>
                        </div>

                        {entries.length === 0 ? (
                            <div className="journal-grid">
                                <h2>Your journal is waiting.</h2>
                                <p>
                                    Create your first entry to begin recording your herbal experiences and discoveries.
                                </p>
                            </div>
                        ) : (
                            <div className="journal-grid">
                                {entries.map((entry) => (
                                    <article 
                                        key={entry._id}
                                        className="journal-entry-card"
                                    >
                                        <div className="journal-entry-header">
                                            <div>
                                                <p className="journal-entry-eyebrow">
                                                    HERBAL JOURNAL
                                                </p>
                                                <h3>{entry.title}</h3>
                                            </div>

                                            <span 
                                                className={entry.isPublic
                                                                ? "journal-visibility public"
                                                                : "journal-visibility private"
                                                }
                                            >
                                                {entry.isPublic
                                                    ? "Public"
                                                    : "Private"}
                                            </span>
                                        </div>

                                        <p className="journal-entry-herb">
                                            <span>Herb:</span>{" "}
                                            {entry.herb?.name || "Unknown herb"}
                                        </p>

                                        <p className="journal-entry-content">{entry.content}</p>

                                        <div className="journal-entry-actions">
                                            <button 
                                                type="button"
                                                className="journal-edit-button"
                                                onClick={() => handleEdit(entry)}
                                            >
                                                Edit
                                            </button> 

                                            <button 
                                                type="button"
                                                className="journal-delete-button"
                                                onClick={() => handleDelete(entry._id)}
                                            >
                                                Delete
                                            </button> 
                                        </div>
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

export default Journal;