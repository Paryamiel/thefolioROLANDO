import React, { useState, useEffect } from 'react';
import './About.css'; // Import your specific quiz styles

// Our master quiz data pulled out of the component
const masterQuizData = [
    { q: "First high-level language (1957)?", o: ["C", "FORTRAN", "COBOL", "BASIC"], a: 1, h: "Formula Translation." },
    { q: "First algorithm intended for machine?", o: ["Alan Turing", "Grace Hopper", "Ada Lovelace", "Bill Gates"], a: 2, h: "Analytical Engine associate." },
    { q: "JS was created in how many days?", o: ["10 Days", "30 Days", "100 Days", "1 Year"], a: 0, h: "Created in 1995 for Netscape." },
    { q: "Foundation of Unix in the 70s?", o: ["C", "Pascal", "Assembly", "B"], a: 0, h: "Dennis Ritchie's masterpiece." },
    { q: "What was Python named after?", o: ["Snakes", "Pet", "Monty Python", "Greek myth"], a: 2, h: "A comedy troupe." },
    { q: "Which language used 'Punch Cards'?", o: ["Java", "FORTRAN", "Swift", "PHP"], a: 1, h: "Early scientific language." },
    { q: "Who created Java?", o: ["Microsoft", "Sun Microsystems", "Apple", "Google"], a: 1, h: "Acquired by Oracle later." },
    { q: "The Web's first markup language?", o: ["HTML", "C++", "Python", "SQL"], a: 0, h: "Used to structure pages." },
    { q: "Famous for 'Write Once, Run Anywhere'?", o: ["C++", "Python", "Java", "Ruby"], a: 2, h: "Uses the JVM." },
    { q: "Bjarne Stroustrup created which one?", o: ["C#", "Objective-C", "C++", "Rust"], a: 2, h: "C with Classes." },
    { q: "Oldest language still in wide use?", o: ["FORTRAN", "Assembly", "Lisp", "COBOL"], a: 0, h: "Scientific calculating power." },
    { q: "Primary language for iOS apps today?", o: ["Kotlin", "Swift", "Dart", "C#"], a: 1, h: "Replaced Objective-C." },
    { q: "Developed by Microsoft in 2000?", o: ["Python", "C#", "Java", "Go"], a: 1, h: "Pronounced C-Sharp." },
    { q: "Language with the Gopher mascot?", o: ["Rust", "Go", "Perl", "Haskell"], a: 1, h: "Modern Google language." },
    { q: "Designed for business in 1959?", o: ["COBOL", "BASIC", "FORTRAN", "ALGOL"], a: 0, h: "Common Business-Oriented." }
];

const About = () => {
    // React State to replace direct DOM manipulation
    const [currentQuiz, setCurrentQuiz] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    
    // UI states
    const [result, setResult] = useState({ text: '', color: '' });
    const [hintUsed, setHintUsed] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    // Shuffle and initialize the quiz
    const initQuiz = () => {
        const shuffled = [...masterQuizData].sort(() => Math.random() - 0.5);
        setCurrentQuiz(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        resetTurn();
    };

    const resetTurn = () => {
        setSelectedOption(null);
        setResult({ text: '', color: '' });
        setHintUsed(false);
        setIsAnswered(false);
    };

    // Run initQuiz once when the component first loads
    useEffect(() => {
        initQuiz();
    }, []);

    const handleHint = () => {
        setResult({ text: `Hint: ${currentQuiz[currentIndex].h}`, color: '#856404' });
        setHintUsed(true);
    };

    const handleSubmit = () => {
        setIsAnswered(true);
        const data = currentQuiz[currentIndex];
        
        if (selectedOption === data.a) {
            setScore(prev => prev + 1);
            setResult({ text: 'Correct! ✨', color: 'green' });
        } else {
            setResult({ text: `Wrong! It was ${data.o[data.a]}.`, color: 'red' });
        }

        // Wait 1.5 seconds, then move to next question
        setTimeout(() => {
            if (currentIndex + 1 < currentQuiz.length) {
                setCurrentIndex(prev => prev + 1);
                resetTurn();
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };

    // If quiz hasn't loaded yet, show nothing
    if (currentQuiz.length === 0) return null;

    const currentData = currentQuiz[currentIndex];
    const progressPercentage = isFinished ? 100 : (currentIndex / currentQuiz.length) * 100;

    return (
        <>
            <section style={{ textAlign: 'center' }}>
                <h2>What I Love</h2>
                <p>I enjoy solving problems, helping users, and improving system efficiency.</p>
                <img src="/images/codes.jpeg" alt="Programming and Code Visualization" style={{ display: 'block', margin: '20px auto', maxWidth: '100%', borderRadius: '12px' }} />
            </section>

            <section style={{ textAlign: 'center' }}>
                <h2>My Journey</h2>
                <ol style={{ display: 'inline-block', textAlign: 'left' }}>
                    <li>Learning basic computer systems</li>
                    <li>Customer service experience</li>
                    <li>IT infrastructure and support roles</li>
                </ol>
                <img src="/images/works.jpg" alt="Our Team at Work" style={{ display: 'block', margin: '20px auto', maxWidth: '100%', borderRadius: '12px' }} />
            </section>

            <section style={{ textAlign: 'center' }}>
                {/* Notice how inline styles become JavaScript objects in React */}
                <blockquote style={{ fontStyle: 'italic', borderLeft: '5px solid #007bff', paddingLeft: '15px', display: 'inline-block' }}>
                    “Technology is best when it brings people together.” – Matt Mullenweg
                </blockquote>
            </section>

            <section className="quiz-section">
                <h2 style={{ textAlign: 'center' }}>The History of Code</h2>
                <p style={{ textAlign: 'center' }}>Can you master all {currentQuiz.length} randomized questions?</p>
                
                {/* Dynamic Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <div id="quiz-container">
                    {isFinished ? (
                        <>
                            <h3 style={{ textAlign: 'center' }}>Quiz Complete!</h3>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <h3>Score: {score} / {currentQuiz.length}</h3>
                            </div>
                            <div className="quiz-controls">
                                <button id="restartBtn" onClick={initQuiz}>Restart Quiz</button>
                            </div>
                            <div style={{ color: 'green', marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                                {score > 10 ? "Excellent Knowledge! 🏆" : "Good Try!"}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>{currentIndex + 1}. {currentData.q}</h3>
                            <div className="options">
                                {/* We map over the array of options to render them dynamically */}
                                {currentData.o.map((opt, idx) => (
                                    <div 
                                        key={idx}
                                        className={`option ${selectedOption === idx ? 'selected' : ''}`}
                                        onClick={() => !isAnswered && setSelectedOption(idx)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                            <div className="quiz-controls">
                                <button 
                                    id="submitBtn" 
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null || isAnswered}
                                >
                                    Submit Answer
                                </button>
                                <button 
                                    id="hintBtn" 
                                    onClick={handleHint}
                                    disabled={hintUsed || isAnswered}
                                >
                                    Hint
                                </button>
                            </div>
                            <div style={{ color: result.color, marginTop: '15px', fontWeight: 'bold', textAlign: 'center', minHeight: '24px' }}>
                                {result.text}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default About;