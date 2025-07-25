import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClickAnywhere = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Homepage Component
  const Homepage = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
      e.preventDefault();
      setIsAuthenticated(true);
      navigate('/dashboard');
    };

    return (
      <div className="App" onClick={!isAuthenticated ? handleClickAnywhere : undefined}>
        {/* Professional Grid Background */}
        <div className="grid-background"></div>
        
        {/* Subtle Particles */}
        <div className="particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 3}`}></div>
          ))}
        </div>

        {!isAuthenticated ? (
          <div className={`welcome-screen ${isAnimating ? 'fade-out' : ''}`}>
            <div className="hero-content">
              <div className="logo-container">
                <div className="logo-wrapper">
                  <img src="/NEWHACSLogo.jpg" alt="HACS Logo" className="company-logo" />
                  <div className="logo-glow"></div>
                  <div className="logo-particles">
                    <div className="logo-particle"></div>
                    <div className="logo-particle"></div>
                    <div className="logo-particle"></div>
                  </div>
                </div>
              </div>
              <p className="subtitle">Hospitality Analytics Cloud Services</p>
              <div className="interactive-elements">
                <div className="floating-globe globe-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="globe-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="floating-globe globe-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="globe-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="floating-globe globe-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="globe-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>
              <div className="cta-text">
                <div className="pulse-dot"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-screen">
            <div className="login-header">
              <div className="login-logo">
                <img src="/NEWHACSLogo.jpg" alt="HACS Logo" className="login-logo-img" />
              </div>
              <h2>System Access</h2>
              <div className="login-status">
                <div className="status-indicator"></div>
              </div>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input type="text" placeholder="Enter your username" required />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" required />
                <div className="input-border"></div>
              </div>
              <button type="submit">
                <span>Sign In</span>
                <div className="button-glow"></div>
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

