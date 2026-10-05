import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const { token } = useAuth();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch("http://localhost:8888/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}`},
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load profile");
                }

                setProfile(data.user);
                setBio(data.user.bio || "");
                setProfilePicture(data.user.profilePicture || "");
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            getProfile();
        }
    }, [token]);

    const handleUpdate = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:8888/api/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bio,
                    profilePicture,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setProfile(data.user);
            setBio("");
            setMessage(data.message);
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <section>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h2>My Profile</h2>

            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio || "No bio yet."}</p>
        
        {isEditing ? (
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Profile picture URL"
                    value={profilePicture}
                    onChange={(event) => setProfilePicture(event.target.value)}
                />

                <textarea
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                />

                <button type="submit">Save Profile</button>

                <button
                    type="button"
                    onClick={() => {
                        setBio(profile.bio || "");
                        setProfilePicture(profile.profilePicture || "");
                        setIsEditing(false);
                    }}
                >
                    Cancel
                </button>
            </form>
        ) : (
            <button onClick={() => setIsEditing(true)}>
                Edit Profile
            </button>
        )}
            {message && <p>{message}</p>}
        </section>
    );
};

export default Profile;