// Layout.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css'; // Import your CSS here

function Layout() {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [redScreenVisible, setRedScreenVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const location = useLocation();

  useEffect(() => {
    let interval;

    if (isFirstLoad) {
      // Simulated loading on initial load
      setLoadingPercent(0);
      setLoadingComplete(false);
      setRedScreenVisible(false);

      interval = setInterval(() => {
        setLoadingPercent((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval);

            // Trigger red-screen animation
            setTimeout(() => {
              setRedScreenVisible(true);
              setTimeout(() => {
                setLoadingComplete(true);
                setIsFirstLoad(false); // Mark initial load as complete
              }, 1000); // Duration of red-screen animation
            }, 500); // Delay before red-screen starts

            return 100;
          }
        });
      }, 15); // Adjust speed as needed
    } else {
      // Subsequent navigations: only show red-screen transition
      setLoadingComplete(false);
      setRedScreenVisible(true);

      setTimeout(() => {
        setRedScreenVisible(false);
        setLoadingComplete(true);
      }, 1000); // Duration of red-screen animation
    }

    return () => clearInterval(interval);
  }, [location]);

  return (
    <div>
      {/* Display loading screen only on initial load */}
      {!loadingComplete && isFirstLoad && (
        <div className="loading">
          <p className="loadingText">Loading {loadingPercent}%</p>
        </div>
      )}

      {/* Red-screen transition overlay */}
      {redScreenVisible && <div className="red-screen"></div>}

      {/* Main content */}
      {loadingComplete && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      )}
    </div>
  );
}

export default Layout;