import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const Profile = () => {
    const { token } = useAuth();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

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
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            getProfile();
        }
    }, [token]);

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
        </section>
    );
};

export default Profile;