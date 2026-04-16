import React, { useEffect, useState, useRef } from 'react';
// We also import useNavigate from react-router-dom to do a smooth, instant page transition!
import { useNavigate } from 'react-router-dom'; 
import './Splash.css'; 

const Splash = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Compiling...");
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const canvasRef = useRef(null);
    const navigate = useNavigate(); // Hook to navigate without reloading the page

    useEffect(() => {
        // --- Matrix Animation Logic ---
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const drawMatrix = () => {
            ctx.fillStyle = "rgba(102, 126, 234, 0.1)"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const matrixInterval = setInterval(drawMatrix, 50);

        // --- Progress & Redirect Logic ---
        const steps = ["Compiling...", "Fetching Portfolio...", "Rendering...", "Ready!"];
        let width = 0;

        const progressInterval = setInterval(() => {
            width += Math.random() * 12;
            if (width >= 100) {
                width = 100;
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    setIsFadingOut(true);
                    
                    setTimeout(() => {
                        // Use React Router's navigate instead of window.location for an instant transition!
                        navigate('/home'); 
                    }, 600);
                }, 500);
            }
            
            setProgress(width);
            const stepIdx = Math.min(Math.floor((width / 100) * steps.length), steps.length - 1);
            setStatus(steps[stepIdx]);
        }, 300);

        return () => {
            clearInterval(matrixInterval);
            clearInterval(progressInterval);
        };
    }, [navigate]); // added navigate to dependency array

    return (
        // Updated to use splash-wrapper!
        <div className="splash-wrapper">
            <canvas ref={canvasRef} id="bg-canvas"></canvas>
            
            <div className={`loader-card ${isFadingOut ? 'fade-out' : ''}`} id="loaderCard">
                <div className="icon-container" style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
                <h2>System Boot</h2>
                {/* Updated ID to match CSS */}
                <p id="status">{status}</p>
                {/* Updated ClassName to match CSS */}
                <div className="progress-container">
                    <div 
                        id="progress-fill" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Splash;