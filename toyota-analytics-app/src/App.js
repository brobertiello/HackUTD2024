// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
    return (
        <Router>
            <Routes>

                {/* Route for HomePage */}
                <Route path="/" element={<HomePage />} />

                {/* Route for Cars */}
                <Route path="/cars" element={<CarPage />} />

                {/* Route for Analytics */}
                <Route path="/analytics" element={<AnalyticsPage />} />
                
                {/* Future Routes */}
                {/* Example: */}
                {/* <Route path="/cars" element={<CarPage />} /> */}
                {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
            </Routes>
        </Router>
    );
};

export default App;