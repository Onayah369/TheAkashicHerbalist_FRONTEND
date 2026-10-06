import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

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
                    "http://localhost:8888/api/journal",
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
                    "http://localhost:8888/api/herbs"
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
        setIsPublic("");
        setEditingId("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const url = editingId
            ? `http://localhost:8888/api/journal/${editingId}`
            : "http://localhost:8888/api/journal";

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
                setEntries(
                    entries.map((entry) =>
                        entry._id === editingId ? data.entry : entry
                    )
                );
                setMessage("Journal entry updated successfully.");
            } else {
                setEntries([data.entry, ...entries]);
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
                `http://localhost:8888/api/journal/${entryId}`,
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

            setEntries(
                entries.filter((entry) => entry._id !== entryId)
            );

            setMessage("Journal entry deleted successfully.");
        } catch (error) {
            setError(error.message);
        }
    };

    if (!token) {
        return (
            <main>
                <Link to="/">←  Back to Home</Link>
                <h1>My Journal</h1>
                <p>Please log in to view your journal.</p>
            </main>
        );
    }

    return (
        <main>
            <Link to="/">←  Back to Home</Link>
            <h1>My Journal</h1>

            <section>
                <h2>
                    {editingId ? "Edit Journal Entry" : "New Journal Entry"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Entry Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />

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

                    <textarea
                        placeholder="Write your journal entry..."
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        required
                    />

                    <label>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(event) =>
                                setIsPublic(event.target.checked)
                            }
                        />
                            Make this entry public
                    </label>

                    <button type="submit">
                        {editingId ? "Update Entry" : "Create Entry"}
                    </button>

                    {editingId && (
                        <button type="button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </form>
            </section>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <section>
                <h2>Your Journal Entries</h2>

                {entries.length === 0 ? (
                    <p>You haven't created any journal entries yet.</p>
                ) : (
                    entries.map((entry) => (
                        <article key={entry._id}>
                            <h3>{entry.title}</h3>

                            <p>
                                Herb:{""}
                                {entry.herb?.name || "Unknown herb"}
                            </p>

                            <p>{entry.content}</p>

                            <p>
                                {entry.isPublic
                                ? "Public"
                                : "Private"}
                            </p>

                            <button onClick={() => handleEdit(entry)}>
                                    Edit
                            </button> 

                            <button onClick={() => handleDelete(entry._id)}>
                                Delete
                            </button> 
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}

export default Journal;