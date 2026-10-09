import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch("https://theakashicherbalist-backend.onrender.com/api/auth/me", {
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
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            getProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleUpdate = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch("https://theakashicherbalist-backend.onrender.com/api/auth/me", {
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
            setBio(data.user.bio || "");
            setMessage("Profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!token) {
        return (
            <>

                <Navbar pageTitle="Profile" />
                <main className="profile-page">
                    <section className="profile-card">
                        <p className="profile-eyebrow">MEMBERS ONLY</p>
                        <h1>Login Required</h1>
                        <p>
                            Please log in to view and edit your profile.
                        </p>

                        <button 
                            className="profile-primary-button"
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

                <Navbar pageTitle="Profile" />
                <main className="profile-page">
                    <p className="profile-status">Loading profile...</p>
                </main>
            </>
        );
    }

    if (error && !profile) {
        return (
            <>

                <Navbar pageTitle="Profile" />
                <main className="profile-page">
                    <section className="profile-card">
                        <p className="profile-error">{error}</p>
                    </section>
                </main>
            </>
        );
    }

        return (
            <>

                <Navbar pageTitle="My Profile" />
                <main className="profile-page">
                    <section className="profile-card">

                        <div className="profile-heading">
                            <p className="profile-eyebrow">YOUR HERBAL JOURNEY</p>
                            <h2>My Profile</h2>
                            <p>
                                Manage your personal information and community presence.
                            </p>
                        </div>

                        <div className="profile-avatar">
                                <span>
                                    {profile.username ?.charAt(0).toUpperCase()}
                                </span>
                        </div>
                    
                    {!isEditing ? (
                        <div className="profile-details">
                            <div className="profile-detail">
                                <span>Username</span>
                                <strong>{profile.username}</strong>
                            </div>
                            <div className="profile-detail">
                                <span>Email</span>
                                <strong>{profile.email}</strong>
                            </div>
                            <div className="profile-detail profile-bio">
                                <span>Bio</span>
                                <p>
                                    {profile.bio || "Don't be shy. Tell us a little about yourself."}
                                </p>
                            </div>

                            <button 
                                type="button"
                                className="profile-primary-button"
                                onClick={() => {
                                    setBio(profile.bio || "");
                                    setMessage("");
                                    setIsEditing(true);
                                }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form 
                            className="profile-form"
                            onSubmit={handleUpdate}
                        >

                            <div className="profile-form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                id="bio"
                                placeholder="Tell us about yourself"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                            />
                            </div>
                            
                            {error && (
                                <p className="profile-error">{error}</p>
                            )}

                            <div className="profile-actions">
                                <button 
                                    type="submit"
                                    className="profile-primary-button"
                                >
                                    Save Profile
                                </button>

                                <button
                                    type="button"
                                    className="profile-secondary-button"
                                    onClick={() => {
                                        setBio(profile.bio || "");
                                        setError("");
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                        {message && <p className="profile-success">{message}</p>}
                    </section>
                </main>
        </>
    );
};

export default Profile;