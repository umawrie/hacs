import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Register from './Register'
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Separate LoginScreen component to prevent interference
const LoginScreen = ({ onLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
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
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input 
            type="text" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={(e) => handleInputChange('email', e.target.value)}
            required 
          />
          <div className="input-border"></div>
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={(e) => handleInputChange('password', e.target.value)}
            required 
          />
          <div className="input-border"></div>
        </div>
        <button type="submit">
          <span>Sign In</span>
          <div className="button-glow"></div>
        </button>
      </form>
      <br></br>
      <div className="registerButton">
        <button type="button" onClick={onRegister}>
          <span>Create New Account</span>
          <div className="button-glow"></div>
        </button>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'login', 'dashboard'

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('welcome');
  };

  const goToLogin = () => {
    console.log('goToLogin called, setting currentView to login');
    setCurrentView('login');
  };

  // Monitor currentView changes
  useEffect(() => {
    console.log('currentView changed to:', currentView);
  }, [currentView]);

  // Homepage Component
  const Homepage = () => {
    const handleLogin = async (formData) => {
      const {email, password} = formData;
      console.log('Attempting login with:', { email, password });
      try {
        console.log('Making POST request to /api/auth/login');
        const response = await axios.post('/', {
          email,
          password
        })
        console.log('Login response:', response.data);
        if(response.data.error){
          toast.error(response.data.error)
        } else if(response.data.success && response.data.user){
          // Save user data to sessionStorage
          sessionStorage.setItem("email", response.data.user.email)
          sessionStorage.setItem("firstName", response.data.user.firstName)
          sessionStorage.setItem("lastName", response.data.user.lastName)
          sessionStorage.setItem("username", response.data.user.username)
          sessionStorage.setItem("userId", response.data.user.id)
          
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        } else{
          toast.error('Login successful but user data not received')
        }
      } catch (error) {
        console.error('Login error details:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        toast.error('Network error. Please try again.');
      }
    };

    const toRegisterPage = (e) => {
      e.preventDefault()
      console.log('Setting currentView to register');
      setCurrentView('register')
    };

    // Render welcome screen
    if (currentView === 'welcome') {
      return (
        <div className="App">
          {/* Professional Grid Background */}
          <div className="grid-background"></div>
          
          {/* Subtle Particles */}
          <div className="particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 3}`}></div>
            ))}
          </div>

          <div className="welcome-screen" onClick={goToLogin}>
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
        </div>
      );
    }

    // Render login screen
    if (currentView === 'login') {
      return (
        <div className="App">
          {/* Professional Grid Background */}
          <div className="grid-background"></div>
          
          {/* Subtle Particles */}
          <div className="particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 3}`}></div>
            ))}
          </div>

          <LoginScreen 
            onLogin={handleLogin}
            onRegister={toRegisterPage}
          />
        </div>
      );
    }

    // Render register screen
    if (currentView === 'register') {
      console.log('Rendering register screen');
      return (
        <div className="App">
          {/* Professional Grid Background */}
          <div className="grid-background"></div>
          
          {/* Subtle Particles */}
          <div className="particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 3}`}></div>
            ))}
          </div>

          <Register onBackToLogin={() => setCurrentView('login')} />
        </div>
      );
    }

    // Render dashboard
    if (currentView === 'dashboard') {
      return <Dashboard onLogout={handleLogout} />;
    }

    // This should never happen, but just in case
    return null;
  };

  return (
    <>
    <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
    <Homepage />
    </>
  );
}

export default App;

