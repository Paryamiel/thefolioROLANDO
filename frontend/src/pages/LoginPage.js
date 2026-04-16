// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css'; // We can reuse your awesome Phase 1 CSS here!

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    
    // Pull the login function from our AuthContext
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(''); 
        
        try {
            console.log("1. Attempting to log in...");
            const user = await login(email, password);
            
            console.log("2. Login function finished! What did it return?", user);

            // Redirect based on their role in MongoDB!
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            // FINALLY! Let's print the real error to the console:
            console.error("🚨 REAL ERROR CAUGHT:", err);
            
            setServerError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <>
            <section style={{ textAlign: 'center', marginTop: '40px' }}>
                <h2>Welcome Back!</h2>
                <p>Log in to your account to manage your profile and interact with posts.</p>
            </section>

            <section className="register-container">
                <form onSubmit={handleSubmit} noValidate>
                    
                    {/* Error display box */}
                    {serverError && (
                        <div className="error" style={{ textAlign: 'center', marginBottom: '15px', color: '#d9534f', fontWeight: 'bold' }}>
                            {serverError}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="johndoe@example.com" 
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required
                        />
                    </div>

                    {/* Reusing your custom button ID for styling */}
                    <button type="submit" id="regBtn">Login to Account</button>
                    
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
                    </p>
                </form>
            </section>
        </>
    );
};

export default LoginPage;