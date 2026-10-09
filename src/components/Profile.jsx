import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const Profile = () => {
    const { token } = useAuth();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState("");

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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setProfile(data.user);
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
            <h2>My Profile</h2>

            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio || "No bio yet."}</p>

            <form onSubmit={handleUpdate}>

                <textarea
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                />

                <button type="submit">Save Profile</button>
            </form>

            {message && <p>{message}</p>}
        </section>
    );
};

export default Profile;