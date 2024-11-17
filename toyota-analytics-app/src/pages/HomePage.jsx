import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [redScreenVisible, setRedScreenVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingPercent((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    clearInterval(interval);

                    document.getElementsByClassName('loadingText')[0].style.animation = 'pop 0.5s ease-in-out forwards';

                    setTimeout(() => {
                        setRedScreenVisible(true);
                        setTimeout(() => {
                            setLoadingComplete(true);
                        }, 1000);
                    }, 500);

                    return 100;
                }
            });
        }, 15); // Adjust speed as needed

        return () => clearInterval(interval);
    }, []);

    return (
        <>

            {!loadingComplete && (
                <div className="loading">
                    <p class="loadingText">Loading {loadingPercent}%</p>
                </div>
            )}

            {redScreenVisible && (
                <div className="red-screen"></div>
            )}

            {loadingComplete && (
                <div className="container">
                    {/* Logo and Title Centered */}
                    <div className="logo-container">
                        <a href="https://www.toyota.com" target="_blank" rel="noopener noreferrer">
                            <img 
                                src={require('../assets/ToyotaLogo.png')} 
                                alt="Toyota Logo"
                                className="logo"
                            />
                        </a>
                        <h2>ToyoTrends: A Car Analytics App for Toyota Engineers</h2>
                    </div>

                    {/* Buttons Row */}
                    <div className="row">
                        <button className="launch-button" onClick={() => window.location.href = '/cars'}>View Cars</button>
                        <button className="launch-button" onClick={() => window.location.href = '/analysis'}>View Analysis</button>
                    </div>

                    {/* Footer Links */}
                    <div className="footer">
                        <a href="#" target="_blank">About</a>
                        <a href="#" target="_blank">Devpost</a>
                    </div>
                </div>
            )}

        </>
    );
};

export default HomePage;