import React, { useState } from 'react';
import './Contact.css';
import API from '../api/axios';

const Contact = () => {
    // 1. State for our form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // 2. State for our validation errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    // 3. State to control the success modal
    const [showModal, setShowModal] = useState(false);
    
    // 4. State to handle network errors
    const [submitError, setSubmitError] = useState('');

    // Handle input changes in real-time
    const handleChange = (e) => {
        const { id, value } = e.target;
        // Update the form data
        setFormData(prev => ({ ...prev, [id]: value }));
        
        // Clear the specific error when the user starts typing
        if (value.trim() !== '') {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    // Handle form submission and validation
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        let isValid = true;
        let newErrors = { name: '', email: '', message: '' };
        setSubmitError(''); // Clear any previous submission errors

        // Name Validation
        if (formData.name.trim() === '') {
            newErrors.name = 'Please enter your name.';
            isValid = false;
        }

        // Email Validation using regex
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!formData.email.match(emailPattern)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Message Validation
        if (formData.message.trim() === '') {
            newErrors.message = 'Please enter a message.';
            isValid = false;
        }

        setErrors(newErrors);

        // If validation passes, send the data to the backend!
        if (isValid) {
            try {
                // 🟢 THIS sends the form data to our new backend route
                await API.post('/contact', formData);
                
                // If the request is successful, show the modal and clear the form
                setShowModal(true);
                setFormData({ name: '', email: '', message: '' }); 
                
            } catch (err) {
                console.error("Failed to send message:", err);
                setSubmitError(err.response?.data?.message || "Something went wrong sending your message. Please try again.");
            }
        }
    };

    return (
        <>
            <section style={{ textAlign: 'center', marginTop: '40px' }}>
                <h2>Get in Touch</h2>
                <p>Have a question or want to work together? Drop me a message!</p>
            </section>

            <section className="contact-container">
                {/* Display any network/server errors here */}
                {submitError && <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px', color: '#dc3545' }}>{submitError}</div>}
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        {/* Note: 'for' becomes 'htmlFor' in React */}
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'invalid' : ''}
                            placeholder="John Doe" 
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'invalid' : ''}
                            placeholder="john@example.com" 
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea 
                            id="message" 
                            rows="5" 
                            value={formData.message}
                            onChange={handleChange}
                            className={errors.message ? 'invalid' : ''}
                            placeholder="Your message here..."
                        ></textarea>
                        {errors.message && <span className="error-text">{errors.message}</span>}
                    </div>

                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </section>

            {/* Conditional Rendering: Only show modal if showModal is true */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Message Sent!</h3>
                        <p>Thanks for reaching out. I'll get back to you soon.</p>
                        <button 
                            className="submit-btn" 
                            style={{ margin: '15px auto 0', display: 'block' }} 
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Contact;