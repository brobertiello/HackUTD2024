import React from 'react';
import './HomePage.css';

const HomePage = () => {
    const launchApp = () => {
        alert('Launching Toyota Vehicle Analytics App!');
        window.location.href = '/cars';
    };

    return (
        <div className="container">
            {/* Logo and Title Centered */}
            <div className="logo-container">
                <img 
                    src={require('../assets/ToyotaLogo.png')}
                    alt="Toyota Logo"
                    className="logo"
                />
                <h2>Car Analytics App for Engineers</h2>
            </div>

            {/* Launch Button */}
            <div className="row">
                <button className="launch-button" onClick={launchApp}>Launch</button>
            </div>

            {/* Footer Links */}
            <div className="footer">
                <a href="#" target="_blank">About</a>
                <a href="#" target="_blank">Devpost</a>
            </div>
        </div>
    );
};

export default HomePage;