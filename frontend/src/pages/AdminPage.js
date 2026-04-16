import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import './SinglePostPage.css'; 

const AdminPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'posts', 'messages'
    
    // State for our data
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🛡️ Security Check: Boot non-admins back to the home page
    if (!user || user.role !== 'admin') {
        return <Navigate to="/home" />;
    }

    // 🔄 Fetch data based on the active tab
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'users') {
                    const { data } = await API.get('/auth/users');
                    setUsers(data);
                } else if (activeTab === 'posts') {
                    const { data } = await API.get('/posts');
                    setPosts(data);
                } else if (activeTab === 'messages') {
                    const { data } = await API.get('/contact');
                    setMessages(data);
                }
            } catch (err) {
                console.error(`Failed to fetch ${activeTab}:`, err);
            }
            setLoading(false);
        };
        fetchData();
    }, [activeTab]);

    // 🗑️ Delete Functions
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this post and all its comments?")) return;
        try {
            await API.delete(`/posts/${postId}`);
            setPosts(posts.filter(post => post._id !== postId)); // Remove from screen instantly
        } catch (err) { console.error("Failed to delete post", err); }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await API.delete(`/posts/${postId}/comments/${commentId}`);
            // Update the specific post in our state to remove the comment visually
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: post.comments.filter(c => c._id !== commentId) };
                }
                return post;
            }));
        } catch (err) { console.error("Failed to delete comment", err); }
    };

    const handleDeleteMessage = async (msgId) => {
        if (!window.confirm("Mark this message as resolved and delete?")) return;
        try {
            await API.delete(`/contact/${msgId}`);
            setMessages(messages.filter(msg => msg._id !== msgId));
        } catch (err) { console.error("Failed to delete message", err); }
    };

    return (
        <div className="admin-container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>👑 Admin Dashboard</h1>

            {/* 📑 TABS */}
            <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Accounts</button>
                <button className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>📝 Posts & Comments</button>
                <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>✉️ Concerns</button>
            </div>

            <hr style={{ marginBottom: '30px', borderColor: 'var(--border-color, #eee)' }} />

            {loading ? <h3 style={{ textAlign: 'center' }}>Loading...</h3> : (
                <div className="admin-content">
                    
                    {/* 👥 USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="admin-list">
                            <h3>Registered Accounts ({users.length})</h3>
                            {users.map(u => (
                                <div key={u._id} className="admin-card">
                                    <p><strong>Name:</strong> {u.name} | <strong>Email:</strong> {u.email}</p>
                                    <p>
                                        <strong>Role:</strong> <span style={{ color: u.role === 'admin' ? '#dc3545' : '#28a745' }}>{u.role.toUpperCase()}</span> | 
                                        <strong> Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 📝 POSTS & COMMENTS TAB */}
                    {activeTab === 'posts' && (
                        <div className="admin-list">
                            <h3>All Posts ({posts.length})</h3>
                            {posts.map(post => (
                                <div key={post._id} className="admin-card" style={{ borderLeft: '5px solid #007bff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4>{post.title}</h4>
                                            <p style={{ color: 'gray', fontSize: '0.9rem' }}>By: {post.author?.name || 'Unknown'} | Comments: {post.comments?.length || 0}</p>
                                        </div>
                                        <button onClick={() => handleDeletePost(post._id)} className="btn-danger">🗑️ Delete Post</button>
                                    </div>
                                    
                                    {/* Sub-list for Comments */}
                                    {post.comments && post.comments.length > 0 && (
                                        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                                            <strong>Comments:</strong>
                                            {post.comments.map(comment => (
                                                <div key={comment._id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>"{comment.text}" - <em>{comment.author?.name || 'Unknown'}</em></p>
                                                    <button onClick={() => handleDeleteComment(post._id, comment._id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>✖ Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✉️ MESSAGES/CONCERNS TAB */}
                    {activeTab === 'messages' && (
                        <div className="admin-list">
                            <h3>Contact Submissions ({messages.length})</h3>
                            {messages.length === 0 ? <p>No concerns right now! 🎉</p> : null}
                            {messages.map(msg => (
                                <div key={msg._id} className="admin-card" style={{ borderLeft: '5px solid #ffc107' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4>From: {msg.name} ({msg.email})</h4>
                                        <button onClick={() => handleDeleteMessage(msg._id)} className="btn-success">✅ Mark Resolved & Delete</button>
                                    </div>
                                    <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"{msg.message}"</p>
                                    <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '10px' }}>Received: {new Date(msg.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default AdminPage;