import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; // 1. Pull in your Auth Context

const Navbar = () => {
    const [isDark, setIsDark] = useState(false);
    
    // 2. Extract the user object and logout function from your context
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => { 
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    // 3. Create a quick logout handler
    const handleLogout = () => {
        logout(); // This clears the token from localStorage and resets the user state
        navigate('/login'); // Sends them back to the login page
    };

    return (
        <header>
            <h2>My Portfolio</h2>
            <nav>
                <button id="theme-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
                    <span id="mode-icon">{isDark ? "☀️" : "🌙"}</span>
                </button>
                <ul>
                    <li><Link to="/home" className="active">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/create-post">Create Post</Link></li>
                    {/* 🟢 NEW: The Profile Link! */}
                    <li><Link to="/profile">Profile</Link></li>
                    {user && user?.role === 'admin' && (
    <Link to="/admin" style={{ color: '#dc3545', fontWeight: 'bold' }}>Admin Dashboard</Link>
)}
                    {/* 4. The Magic: Conditional Rendering! */}
                    {user ? (
                        <>
                            {/* Shows a nice greeting using their first name */}
                            <li><span style={{ fontWeight: 'bold', color: '#007bff' }}>Hi, {user?.name.split(' ')[0]}</span></li>
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: '#d9534f', 
                                        fontWeight: 'bold', 
                                        cursor: 'pointer',
                                        fontSize: 'inherit',
                                        padding: 0
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login" style={{ fontWeight: 'bold' }}>Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;