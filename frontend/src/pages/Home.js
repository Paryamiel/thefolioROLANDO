import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard'; 
import API from '../api/axios'; // 1. Import your configured Axios instance!

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch the actual data from your database!
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await API.get('/posts');
                setPosts(data); // Put the MongoDB data into state
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setIsLoading(false); // Stop the loading spinner
            }
        };

        fetchPosts();
    }, []);

    // 3. Re-run Lucide icons whenever posts finish loading
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [posts, isLoading]);

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>My Portfolio</h1>
                    <p>The intersection of what I love to do and everything I’ve learned along the way.</p>

                    <ul className="hero-list">
                        <li><i data-lucide="map-pin" size="18"></i> Personal Journey</li>
                        <li><i data-lucide="folder-kanban" size="18"></i> Resources</li>
                        <li><i data-lucide="zap" size="18"></i> Skills and Interest</li>
                    </ul>

                    <div className="button-group">
                        <Link to="/contact" className="btn-primary">Get in Touch</Link>
                        <Link to="/about" className="secondary">Learn More</Link>
                    </div>
                </div>

                <div className="profile-container">
                    <img src="/images/me.jpg" alt="Profile of Rolando" />
                    <div className="glow-effect"></div>
                </div>
            </section>

            <section className="info-card">
                <div className="section-title">
                    <i data-lucide="user"></i>
                    <h2>About Me</h2>
                </div>
                <p>Technology is always evolving, and so am I. My professional journey is a commitment to mastering new tools and turning complex technical challenges into smooth, efficient experiences.</p>
            </section>

            {/* MONGODB BLOG FEED SECTION */}
            <section className="info-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
                <div className="section-title" style={{ marginBottom: '30px' }}>
                    <i data-lucide="book-open"></i>
                    <h2>Latest Articles</h2>
                </div>
                
                <div className="blog-list">
                    {/* Handle loading state and empty database gracefully */}
                    {isLoading ? (
                        <p style={{ textAlign: 'center' }}>Connecting to database...</p>
                    ) : posts.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: '#666' }}>
                            No posts found. Write your first article to see it here!
                        </p>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}
                </div>
            </section>
        </>
    );
};

export default Home;