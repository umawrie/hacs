import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  // Check if user is already logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('hacs_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

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
    setShowRegistration(false);
    setCurrentUser(null);
    localStorage.removeItem('hacs_current_user');
    setErrorMessage('');
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
    setErrorMessage('');
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setErrorMessage('');
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const clearForm = (formElement) => {
    formElement.reset();
  };



  // Homepage Component
  const Homepage = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage('');
      
      const formData = new FormData(e.target);
      const username = formData.get('username');
      const password = formData.get('password');

      // Call MongoDB backend API
      fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showError(data.error);
        } else {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('hacs_current_user', JSON.stringify(data.user));
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        showError('Network error. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    };

    const handleRegistration = (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage('');
      
      const formData = new FormData(e.target);
      
      const newUser = {
        id: Date.now().toString(),
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim().toLowerCase(),
        username: formData.get('username').trim(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        createdAt: new Date().toISOString(),
        profilePhoto: null,
        settings: {
          profile: {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            profilePhoto: null
          },
          account: {
            language: 'English',
            region: 'United States',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            numberFormat: '1,234.56'
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            marketingPreferences: false
          },
          privacy: {
            loginActivity: [],
            connectedDevices: []
          },
          billing: {
            paymentMethods: [],
            invoiceHistory: [],
            plan: 'Basic'
          },
          help: {
            contactSupport: 'support@hacs.com',
            knowledgeBase: 'https://help.hacs.com'
          }
        }
      };

      // Validation
      if (newUser.password.length < 6) {
        showError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      if (newUser.password !== newUser.confirmPassword) {
        showError('Passwords do not match. Please try again.');
        setIsLoading(false);
        return;
      }

      if (newUser.username.length < 3) {
        showError('Username must be at least 3 characters long.');
        setIsLoading(false);
        return;
      }

      // Call MongoDB backend API for registration
      fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showError(data.error);
        } else {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('hacs_current_user', JSON.stringify(data.user));
          
          // Show success message and clear form
          alert(`Account created successfully! Welcome to HACS, ${data.user.firstName}!`);
          clearForm(e.target);
          
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        showError('Network error. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                  <img src="./NEWHACSLogo.jpg" alt="HACS Logo" className="company-logo" />
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
                <div className="floating-globe">
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
        ) : !showRegistration ? (
          <div className="login-screen">
            <div className="login-header">
              <div className="login-logo">
                <img src="./NEWHACSLogo.jpg" alt="HACS Logo" className="login-logo-img" />
              </div>
              <h2>System Access</h2>
              <div className="login-status">
                <div className="status-indicator"></div>
              </div>
            </div>
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Enter your username" required />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter your password" required />
                <div className="input-border"></div>
              </div>
              <button type="submit" className="primary-btn" disabled={isLoading}>
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <div className="button-glow"></div>
              </button>
              <button type="button" className="secondary-btn" onClick={handleShowRegistration} disabled={isLoading}>
                <span>Create New Account</span>
                <div className="button-glow"></div>
              </button>
            </form>
          </div>
        ) : (
          <div className="registration-screen">
            <div className="registration-header">
              <div className="registration-logo">
                <img src="./NEWHACSLogo.jpg" alt="HACS Logo" className="login-logo-img" />
              </div>
              <h2>Create Account</h2>
              <div className="back-to-login">
                <button type="button" className="back-btn" onClick={handleBackToLogin}>
                  ← Back to Login
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
            <form className="registration-form" onSubmit={handleRegistration}>
              <div className="form-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="Enter your first name" required />
                  <div className="input-border"></div>
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Enter your last name" required />
                  <div className="input-border"></div>
                </div>
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create a password" required />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Confirm your password" required />
                <div className="input-border"></div>
              </div>
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <button type="button" className="terms-link">Terms of Service</button> and <button type="button" className="terms-link">Privacy Policy</button>
                </label>
              </div>
              <button type="submit" className="primary-btn" disabled={isLoading}>
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
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
              <Dashboard onLogout={handleLogout} currentUser={currentUser} />
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

