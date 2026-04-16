import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; 
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '', 
        password: '',
        confirmPassword: '',
        dob: '',
        level: '', 
        terms: false 
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(''); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: inputValue }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setServerError(''); 
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        let isValid = true;
        let newErrors = {};

        console.log("1. Button clicked! Checking validation...");

        // Front-end Validation
        if (formData.name.trim() === "") { newErrors.name = "Full name is required."; isValid = false; }
        if (formData.email.trim() === "" || !formData.email.includes('@')) { newErrors.email = "Please enter a valid email address."; isValid = false; }
        if (formData.password.length < 6) { newErrors.password = "Password must be at least 6 characters."; isValid = false; }
        if (formData.password !== formData.confirmPassword || formData.confirmPassword === "") { newErrors.confirmPassword = "Passwords do not match."; isValid = false; }
        if (!formData.dob) { newErrors.dob = "Please select your date of birth."; isValid = false; }
        if (!formData.level) { newErrors.level = "Please select an interest level."; isValid = false; }
        if (!formData.terms) { newErrors.terms = "You must agree to the terms."; isValid = false; }

        setErrors(newErrors);

        if (!isValid) {
            console.log("❌ Validation Failed! Here are the errors:", newErrors);
            window.scrollTo(0, 0); 
            return; // Stop right here
        }

        console.log("✅ Validation Passed! Sending data to MongoDB...", formData);

        // If everything passes, SEND TO MONGODB
        try {
            const { data } = await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            console.log("🎉 Server responded with success!", data);
            
            // Save the JWT token
            localStorage.setItem('token', data.token);
            alert("Registration successful!");
            window.location.href = '/home'; 

        } catch (err) {
            console.error("🚨 Backend Error:", err.response?.data);
            setServerError(err.response?.data?.message || 'Registration failed. Email might already exist.');
        }
    };

    return (
        <>
            <section style={{ textAlign: 'center', marginTop: '40px' }}>
                <h2>Sign Up for Updates</h2>
                <p>Join our community and get the latest IT tips and resources.</p>
            </section>

            <section className="register-container">
                <form onSubmit={handleSubmit} noValidate>
                    
                    {serverError && <div className="error" style={{ textAlign: 'center', marginBottom: '15px', color: 'red', fontWeight: 'bold' }}>{serverError}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                        {errors.name && <span className="error" style={{color: 'red'}}>{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="johndoe@example.com" />
                        {errors.email && <span className="error" style={{color: 'red'}}>{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                        {errors.password && <span className="error" style={{color: 'red'}}>{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                        {errors.confirmPassword && <span className="error" style={{color: 'red'}}>{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                        {errors.dob && <span className="error" style={{color: 'red'}}>{errors.dob}</span>}
                    </div>

                    <div className="form-group">
                        <label>Interest Level</label>
                        <div className="radio-group">
                            <label><input type="radio" name="level" value="beginner" checked={formData.level === 'beginner'} onChange={handleChange} /> Beginner</label>
                            <label><input type="radio" name="level" value="intermediate" checked={formData.level === 'intermediate'} onChange={handleChange} /> Intermediate</label>
                            <label><input type="radio" name="level" value="expert" checked={formData.level === 'expert'} onChange={handleChange} /> Expert</label>
                        </div>
                        {errors.level && <span className="error" style={{color: 'red'}}>{errors.level}</span>}
                    </div>

                    <div className="form-group">
                        <label className="checkbox-group">
                            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} /> I agree to the terms & conditions
                        </label>
                        {errors.terms && <span className="error" style={{color: 'red'}}>{errors.terms}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" id="regBtn" style={{ flex: 1 }}>Create Account</button>
                        
                        <Link to="/login" style={{ 
                            flex: 1, 
                            display: 'inline-block', 
                            textAlign: 'center', 
                            background: '#e2e8f0', 
                            color: '#333', 
                            textDecoration: 'none', 
                            padding: '12px', 
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            border: '1px solid #cbd5e1'
                        }}>
                            Login Instead
                        </Link>
                    </div>
                    
                </form>
            </section>
        </>
    );
};

export default Register;