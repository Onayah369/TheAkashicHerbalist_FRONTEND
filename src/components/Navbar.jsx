import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Navbar({ pageTitle, onBack }) {
    const { user, token, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(),
        setMenuOpen(false);
        navigate("/");
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate("/");
        }
        setMenuOpen(false);
    };

    const userInitial = user?.username 
        ? user.username.charAt(0).toUpperCase()
        : "?";

        return (
            <header className={`page-header ${pageTitle ? "inner-page-header" : ""}`}>
                {pageTitle ? (
                    <button 
                        type="button"
                        className="navbar-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>  
                ) : (
                    <Link to="/" className="brand">
                        <span className="brand-icon"span>✦</span>
                        <span className="brand-name">The Akashic Herbalist</span>
                    </Link>
                )}

                {pageTitle && (
                    <Link to="/" className="inner-page-brand">
                        <span className="brand-icon"span>✦</span>
                        <span className="brand-name">The Akashic Herbalist</span>
                    </Link>
                )}
                

                <nav className="nav">

                    {!token ? (
                        <>
                            <Link to="/login" className="nav-button">
                                Login
                            </Link>
                            <Link to="/register" className="nav-button">
                            Create Account</Link>
                        </>
                    ) : (
                        <Link 
                            to="/profile"
                            className="nav-profile"
                            aria-label="View profile"
                        >
                            <span>{userInitial}</span>
                        </Link>
                    )}

                    <button
                        type="button"
                        className="menu-button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                    >
                        ☰
                    </button>

                    {menuOpen && (
                        <div className="menu-dropdown">
                            {token ? (
                                <>
                                    <Link 
                                        to="/profile"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    <Link 
                                        to="/favorites"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Favorites
                                    </Link>
                                    <Link 
                                        to="/collections"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Collections
                                    </Link>
                                    <Link 
                                        to="/journal"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Journal
                                    </Link>

                                    <button
                                        type="button"
                                        className="menu-logout"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/favorites"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Favorites
                                    </Link>
                                    <Link 
                                        to="/collections"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Collections
                                    </Link>
                                    <Link 
                                        to="/journal"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Journal
                                    </Link>
                                    <Link 
                                        to="/profile"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </header>
        );
}

export default Navbar;