import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState(''); // Changed from content to body
    const [image, setImage] = useState(null); // New state for the image file
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Because of multer, we MUST use FormData to send files + text
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if (image) {
            formData.append('image', image);
        }

        try {
            // ✅ Let Axios handle the headers automatically!
            await API.post('/posts', formData);
            navigate('/home'); 
        } catch (err) {
            // Let's also update this to print the REAL error from your backend:
            console.error("🚨 BACKEND ERROR:", err.response?.data?.message || err);
            setError('Failed to create post. Please try again.');
        }
    };

    return (
        <section className="register-container" style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Body</label>
                    <textarea 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                        required 
                        rows="6"
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                </div>

                {/* New Image Upload Field */}
                <div className="form-group">
                    <label>Image (Optional)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])} 
                        style={{ marginTop: '5px' }}
                    />
                </div>
                
                <button type="submit" id="regBtn" style={{ marginTop: '15px', width: '100%' }}>Publish Post</button>
            </form>
        </section>
    );
};

export default CreatePostPage;