import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const EditPostPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState(''); // Changed to body
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setTitle(data.title);
                setBody(data.body); // Changed to body
            } catch (err) {
                console.error("Error fetching post to edit:", err);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const formData = new FormData();
        if (title) formData.append('title', title);
        if (body) formData.append('body', body);
        if (image) formData.append('image', image);

        try {
            // ✅ Let Axios handle the headers automatically!
            await API.put(`/posts/${id}`, formData);
            navigate('/home'); 
        } catch (err) {
            // Let's also update this to print the REAL error from your backend:
            console.error("🚨 BACKEND ERROR:", err.response?.data?.message || err);
            setError('Failed to create post. Please try again.');
        }
    };

    return (
        <section className="register-container" style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Body</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="6" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div className="form-group">
                    <label>Update Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginTop: '5px' }} />
                </div>
                <button type="submit" id="regBtn" style={{ marginTop: '15px', width: '100%' }}>Update Post</button>
            </form>
        </section>
    );
};

export default EditPostPage;