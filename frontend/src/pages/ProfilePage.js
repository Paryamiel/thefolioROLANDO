import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import './SinglePostPage.css'; 

const ProfilePage = () => {
    const { user, setUser } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state for editing
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [error, setError] = useState('');

    // 🛡️ Protect the route
    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Send the updated data to the backend
            const { data } = await API.put('/auth/profile', { name, email });
            
            // 🟢 FIXED: We use setUser instead of login here!
            setUser(data); 
            
            setIsEditing(false); // Close the form
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                
                {/* 🎨 Profile Picture */}
                <div className="profile-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>

                <h2 style={{ marginBottom: '5px' }}>My Profile</h2>
                <p className="text-muted">Manage your account details</p>
                
                <hr className="profile-divider" />
                
                {error && <p className="error-message">{error}</p>}

                {isEditing ? (
                    /* 📝 EDIT MODE FORM */
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                className="profile-input"
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                className="profile-input"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="profile-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </div>
                    </form>
                ) : (
                    /* 👁️ VIEW MODE */
                    <div className="profile-info">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p>
                            <strong>Account Role:</strong>{' '}
                            <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
                                {user.role || 'Member'}
                            </span>
                        </p>
                        <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
                        
                        <button className="btn-primary edit-btn" onClick={() => setIsEditing(true)}>
                            ✏️ Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;