import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './SinglePostPage.css'; 

const SinglePostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState(''); // 🟢 NEW: State for the comment box
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await API.delete(`/posts/${id}`);
                navigate('/home'); 
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    // 🟢 NEW: Function to handle submitting a comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return; // Don't submit empty comments!

        try {
            const { data } = await API.post(`/posts/${id}/comments`, { text: commentText });
            setPost(data); // Update the page instantly with the returned, updated post
            setCommentText(''); // Clear out the textbox
        } catch (err) {
            console.error("Failed to post comment:", err);
            alert(err.response?.data?.message || "Failed to post comment. Make sure you are logged in.");
        }
    };

    if (!post) return <h2 style={{ textAlign: 'center', marginTop: '40px' }}>Loading post...</h2>;

    // Admin or Owner can edit/delete based on your backend logic
    const isOwner = user && user._id === (post.author?._id || post.author);
    const isAdmin = user && user.role === 'admin';
    const canEditOrDelete = isOwner || isAdmin;

    return (
        <div className="single-post-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h1>{post.title}</h1>
            <p className="text-muted" style={{ color: 'gray' }}>By {post.author?.name || 'Unknown Author'}</p>
            <hr />
            
            {post.image && (
                <img 
                    src={`${process.env.REACT_APP_API_URL?.replace('/api','') || ''}/uploads/${post.image}`}
                    alt={post.title} 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px', borderRadius: '8px' }} 
                />
            )}

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginTop: '20px' }}>{post.body}</p>

            {canEditOrDelete && (
                <div style={{ marginTop: '30px' }}>
                    <Link to={`/edit-post/${post._id}`} style={{ marginRight: '15px', color: '#007bff' }}>✏️ Edit</Link>
                    <button onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: '#d9534f', cursor: 'pointer', fontSize: '1rem' }}>
                        🗑️ Delete
                    </button>
                </div>
            )}

            {/* 💬 COMMENTS SECTION */}
            <hr style={{ margin: '40px 0' }} />
            
            <div className="comments-section">
                <h3>Comments ({post.comments?.length || 0})</h3>

                <div className="comments-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <div key={comment._id} className="comment-card">
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong style={{ marginRight: '10px' }}>👤 {comment.author?.name || 'Unknown'}</strong>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ margin: 0 }}>{comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-comments-text">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>

                {user ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginTop: '30px' }}>
                        <textarea
                            className="comment-input"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            rows="3"
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: 'none' }}>
                            Post Comment
                        </button>
                    </form>
                ) : (
                    <p className="comment-login-prompt">
                        <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>Log in</Link> to leave a comment.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SinglePostPage;