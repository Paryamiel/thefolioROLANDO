// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On page load, check if there is a token and fetch the user profile
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            API.get('/auth/me')
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('token')) // remove bad token
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

   // login(): call the backend, save token, store user in state
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        
        localStorage.setItem('token', data.token);
        
        // ✅ CORRECT: Just use 'data' directly!
        setUser(data); 
        return data; 
    };

    // logout(): clear token and user from memory
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}> 
    {children}
</AuthContext.Provider>
    );
};

// Custom hook — use this instead of useContext(AuthContext) everywhere
export const useAuth = () => useContext(AuthContext);