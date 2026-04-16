import React from 'react';
import { Link } from 'react-router-dom'; // 🟢 Added Link for faster navigation
import './PostCard.css';

const PostCard = ({ post }) => {
    // Failsafe: if MongoDB hasn't loaded the data yet, render nothing
    if (!post) return null; 

    return (
        <div className="post-card">
            {/* 🟢 Render the image if it exists */}
            {post.image && (
                <img 
                    src={`http://localhost:5000/uploads/${post.image}`} 
                    alt={post.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} 
                />
            )}
            
            <div style={{ padding: post.image ? '15px' : '0' }}>
                <h3>{post.title}</h3>
                <div className="post-meta">
                    {/* 🟢 Using MongoDB's built-in createdAt and populated author name */}
                    <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span> | 
                    <span>👤 {post.author?.name || 'Admin'}</span>
                </div>
                
                {/* 🟢 Slice the 'body' to make a custom excerpt! */}
                <p className="post-excerpt">
                    {post.body?.length > 120 ? post.body.substring(0, 120) + '...' : post.body}
                </p>
                
                <Link to={`/post/${post._id}`} className="read-more">Read Full Post →</Link>
            </div>
        </div>
    );
};

export default PostCard;