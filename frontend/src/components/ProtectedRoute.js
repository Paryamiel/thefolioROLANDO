import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. We added 'role' to the props being passed in!
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>; 
    }

    // 2. Not logged in? Go to login page.
    if (!user) {
        return <Navigate to="/login" replace />; 
    }

    // 3. THE NEW RULE: If the route requires a specific role, check it!
    if (role && user.role !== role) {
        // They are logged in, but they are NOT an admin. Kick them to home!
        return <Navigate to="/home" replace />;
    }

    // 4. If they pass all checks, let them in!
    return children;
};

export default ProtectedRoute;