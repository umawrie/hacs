import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import axios from 'axios';
import ChartComponent from './components/ChartComponent';

const Dashboard = ({ onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [analyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);

  //getting the userData
  const [userData, setUserData] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userDataError, setUserDataError] = useState(null);

  useEffect(() =>{
    const email = sessionStorage.getItem("email")
    setUserDataLoading(true);
    setUserDataError(null);
    
    axios.get("/userData", {
      params: {email}
  })
    .then(response => {
      setUserData(response.data)
      setUserDataLoading(false);
    })
    .catch(error => {
      console.log(sessionStorage.getItem("email"))
      console.error("Axios error:", error)
      setUserDataError("Failed to load user data");
      setUserDataLoading(false);
    });
  }, [])

  const [settings, setSettings] = useState(() => {
    if (currentUser && currentUser.settings) {
      return currentUser.settings;
    }
    return {
      profile: {
        firstName: currentUser?.firstName || 'User',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || 'user@hacs.com',
        profilePhoto: currentUser?.profilePhoto || null
      },
      account: {
        language: 'en',
        region: 'US',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: '1,234.56'
      },
      notifications: {
        email: true,
        push: false,
        sms: false,
        marketing: false,
        updates: true,
        security: true
      },
      privacy: {
        showEmail: false,
        showActivity: true,
        allowAnalytics: true
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 3600,
        requirePasswordChange: false
      },
      billing: {
        plan: 'Professional',
        nextBilling: '2024-02-01',
        autoRenew: true
      },
      site: {
        logo: 'HACS',
        primaryColor: '#3b82f6',
        customDomain: '',
        theme: 'dark'
      }
    };
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('overview');
  const analyticsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analyticsDropdownRef.current && !analyticsDropdownRef.current.contains(event.target)) {
        setAnalyticsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update settings when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.settings) {
      setSettings(currentUser.settings);
    }
  }, [currentUser]);

  const handleSettingsChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    // Update currentUser in localStorage when settings change
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        settings: {
          ...currentUser.settings,
          [category]: {
            ...currentUser.settings[category],
            [key]: value
          }
        }
      };
      
      // Update localStorage
      localStorage.setItem('hacs_current_user', JSON.stringify(updatedUser));
      
      // Update users array in localStorage
      const allUsers = JSON.parse(localStorage.getItem('hacs_users') || '[]');
      const updatedUsers = allUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('hacs_users', JSON.stringify(updatedUsers));
    }
    
    // Auto-save after each change
    setTimeout(() => {
      saveSettings();
    }, 500);
  };

  const saveSettings = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/auth/user/${currentUser._id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        const data = await response.json();
        setShowSuccessMessage(true);
        
        // Update currentUser with new settings
        if (data.user) {
          const updatedUser = { ...currentUser, settings: data.user.settings };
          localStorage.setItem('hacs_current_user', JSON.stringify(updatedUser));
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const renderSettingsOverview = () => (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p>Manage your account, preferences, and system configuration</p>
      </div>

      <div className="settings-overview">
        <div className="settings-section-card" onClick={() => setActiveSettingsSection('profile')}>
          <div className="section-content">
            <h3>Profile Settings</h3>
            <p>Manage your personal information, profile photo, and authentication</p>
          </div>
        </div>

        <div className="settings-section-card" onClick={() => setActiveSettingsSection('account')}>
          <div className="section-content">
            <h3>Account Preferences</h3>
            <p>Language, region, timezone, and formatting preferences</p>
          </div>
        </div>

        <div className="settings-section-card" onClick={() => setActiveSettingsSection('notifications')}>
          <div className="section-content">
            <h3>Notifications</h3>
            <p>Configure how and when you receive notifications</p>
          </div>
        </div>

        <div className="settings-section-card" onClick={() => setActiveSettingsSection('privacy')}>
          <div className="section-content">
            <h3>Privacy & Security</h3>
            <p>Control your privacy settings and security preferences</p>
          </div>
        </div>

        <div className="settings-section-card" onClick={() => setActiveSettingsSection('billing')}>
          <div className="section-content">
            <h3>Billing & Subscription</h3>
            <p>Manage your subscription, payment methods, and billing</p>
          </div>
        </div>

        <div className="settings-section-card" onClick={() => setActiveSettingsSection('help')}>
          <div className="section-content">
            <h3>Help & Support</h3>
            <p>Get help, access knowledge base, and contact support</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsDetail = (section) => {
    const renderBackButton = () => (
      <button className="back-btn" onClick={() => setActiveSettingsSection('overview')}>
        ← Back to Settings
      </button>
    );

    switch (section) {
      case 'profile':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Profile Settings</h2>
              <p>Manage your personal information and authentication</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Personal Information</h3>
                <div className="setting-item">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={settings.profile.firstName}
                    onChange={(e) => handleSettingsChange('profile', 'firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="setting-item">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={settings.profile.lastName}
                    onChange={(e) => handleSettingsChange('profile', 'lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="setting-item">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={settings.profile.email}
                    onChange={(e) => handleSettingsChange('profile', 'email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="setting-item">
                  <label>Profile Photo</label>
                  <div className="profile-photo-upload">
                    {settings.profile.profilePhoto && (
                      <div className="profile-photo-preview">
                        <img 
                          src={settings.profile.profilePhoto} 
                          alt="Profile Preview" 
                          className="profile-photo-preview-img"
                        />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          handleSettingsChange('profile', 'profilePhoto', imageUrl);
                        }
                      }}
                    />
                    <span className="upload-hint">Upload a profile photo</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Authentication</h3>
                <div className="setting-item">
                  <label>Change Password</label>
                  <button className="secondary-btn">
                    Change Password
                  </button>
                </div>
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <div className="toggle-container">
                    <input 
                      type="checkbox" 
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => handleSettingsChange('security', 'twoFactorEnabled', e.target.checked)}
                    />
                    <span className="toggle-label">
                      {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Account Information</h3>
                {userDataLoading && (
                  <div className="user-data-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your account data...</p>
                  </div>
                )}
                {userDataError && (
                  <div className="user-data-error">
                    <p>⚠️ {userDataError}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}
                {!userDataLoading && !userDataError && userData && userData.length > 0 && (
                  <div className="user-data-grid">
                    {userData.map((data, index) => (
                      <div key={index} className="user-data-card">
                        <h4>Account Data {index + 1}</h4>
                        <div className="data-content">
                          {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="data-item">
                              <span className="data-label">{key}:</span>
                              <span className="data-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!userDataLoading && !userDataError && (!userData || userData.length === 0) && (
                  <div className="user-data-empty">
                    <p>No account data available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Account Preferences</h2>
              <p>Customize your language, region, and formatting preferences</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Localization</h3>
                <div className="setting-item">
                  <label>Language</label>
                  <select 
                    value={settings.account.language} 
                    onChange={(e) => handleSettingsChange('account', 'language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Region</label>
                  <select 
                    value={settings.account.region} 
                    onChange={(e) => handleSettingsChange('account', 'region', e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Time Zone</label>
                  <select 
                    value={settings.account.timezone} 
                    onChange={(e) => handleSettingsChange('account', 'timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Formatting</h3>
                <div className="setting-item">
                  <label>Date Format</label>
                  <select 
                    value={settings.account.dateFormat} 
                    onChange={(e) => handleSettingsChange('account', 'dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Number Format</label>
                  <select 
                    value={settings.account.numberFormat} 
                    onChange={(e) => handleSettingsChange('account', 'numberFormat', e.target.value)}
                  >
                    <option value="1,234.56">1,234.56 (US)</option>
                    <option value="1.234,56">1.234,56 (EU)</option>
                    <option value="1 234.56">1 234.56 (SI)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Notifications</h2>
              <p>Configure how and when you receive notifications</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Notification Channels</h3>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>Push Notifications</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingsChange('notifications', 'push', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>SMS Notifications</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingsChange('notifications', 'sms', e.target.checked)}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Notification Types</h3>
                <div className="setting-item">
                  <label>Marketing Communications</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.marketing}
                    onChange={(e) => handleSettingsChange('notifications', 'marketing', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>System Updates</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.updates}
                    onChange={(e) => handleSettingsChange('notifications', 'updates', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>Security Alerts</label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.security}
                    onChange={(e) => handleSettingsChange('notifications', 'security', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Privacy & Security</h2>
              <p>Control your privacy settings and security preferences</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Privacy Settings</h3>
                <div className="setting-item">
                  <label>Show Email Address</label>
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.showEmail}
                    onChange={(e) => handleSettingsChange('privacy', 'showEmail', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>Show Activity Status</label>
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.showActivity}
                    onChange={(e) => handleSettingsChange('privacy', 'showActivity', e.target.checked)}
                  />
                </div>
                <div className="setting-item">
                  <label>Allow Analytics</label>
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.allowAnalytics}
                    onChange={(e) => handleSettingsChange('privacy', 'allowAnalytics', e.target.checked)}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    min="15" 
                    max="1440"
                    value={settings.security.sessionTimeout / 60}
                    onChange={(e) => handleSettingsChange('security', 'sessionTimeout', parseInt(e.target.value) * 60)}
                  />
                </div>
                <div className="setting-item">
                  <label>Require Password Change</label>
                  <input 
                    type="checkbox" 
                    checked={settings.security.requirePasswordChange}
                    onChange={(e) => handleSettingsChange('security', 'requirePasswordChange', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Billing & Subscription</h2>
              <p>Manage your subscription, payment methods, and billing</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Current Plan</h3>
                <div className="setting-item">
                  <label>Plan Type</label>
                  <span className="plan-badge">{settings.billing.plan}</span>
                </div>
                <div className="setting-item">
                  <label>Next Billing Date</label>
                  <span>{settings.billing.nextBilling}</span>
                </div>
                <div className="setting-item">
                  <label>Auto-Renew</label>
                  <input 
                    type="checkbox" 
                    checked={settings.billing.autoRenew}
                    onChange={(e) => handleSettingsChange('billing', 'autoRenew', e.target.checked)}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Billing Management</h3>
                <div className="setting-item">
                  <label>Payment Methods</label>
                  <button className="secondary-btn">
                    Manage Payment Methods
                  </button>
                </div>
                <div className="setting-item">
                  <label>Invoice History</label>
                  <button className="secondary-btn">
                    View Invoices
                  </button>
                </div>
                <div className="setting-item">
                  <label>Plan Management</label>
                  <button className="secondary-btn">
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="settings-container">
            <div className="settings-header">
              {renderBackButton()}
              <h2>Help & Support</h2>
              <p>Get help, access knowledge base, and contact support</p>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h3>Support Options</h3>
                <div className="setting-item">
                  <label>Contact Support</label>
                  <button className="secondary-btn">
                    Get Help
                  </button>
                </div>
                <div className="setting-item">
                  <label>Knowledge Base</label>
                  <button className="secondary-btn">
                    Browse Articles
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>System Information</h3>
                <div className="setting-item">
                  <label>System Status</label>
                  <span style={{ color: '#10b981' }}>All Systems Operational</span>
                </div>
                <div className="setting-item">
                  <label>Version Information</label>
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderSettingsOverview();
    }
  };

  const renderSettingsTab = () => {
    return renderSettingsDetail(activeSettingsSection);
  };

  const handleWidgetHover = (widgetId) => {
    setHoveredWidget(widgetId);
  };

  const handleWidgetLeave = () => {
    setHoveredWidget(null);
  };

  const toggleAnalyticsDropdown = () => {
    setAnalyticsDropdownOpen(!analyticsDropdownOpen);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
                          <img src={process.env.PUBLIC_URL + '/NEWHACSLogo.jpg'} alt="HACS Logo" className="header-logo" />
          <h1>Hospitality Analytics Cloud Services</h1>
        </div>
        <div className="header-right">
          {settings.profile.profilePhoto ? (
            <img 
              src={settings.profile.profilePhoto} 
              alt="Profile" 
              className="profile-photo-small"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`profile-photo-placeholder ${settings.profile.profilePhoto ? 'hidden' : ''}`}>
            {settings.profile.firstName ? settings.profile.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <div className="nav-tab-wrapper">
          <div className="nav-tab-container">
            <button 
              className={`nav-tab ${activeTab === 'benchmarking' ? 'active' : ''}`}
              onClick={toggleAnalyticsDropdown}
            >
              Benchmarking
            </button>
            {analyticsDropdownOpen && (
              <div className="nav-dropdown" ref={analyticsDropdownRef}>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('adr-reports');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  ADR Reports
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('occupancy-rate');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  Occupancy Rate
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('adr-vs-revpar');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  ADR vs RevPAR
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('revenue');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  Revenue
                </div>
              </div>
            )}
          </div>
        </div>
        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <h2>Welcome Back!</h2>
            

            
            <div className="stats-grid">
              <div 
                className="stat-card clickable"
                onMouseEnter={() => handleWidgetHover('occupancy')}
                onMouseLeave={handleWidgetLeave}
                onClick={() => setActiveTab('occupancy-rate')}
              >
                <h3>Occupancy Rate</h3>
                <p className="stat-number">87%</p>
                <p className="stat-change positive">+5% this month</p>
                {hoveredWidget === 'occupancy' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('occupancy-rate')}>View Details</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card clickable"
                onMouseEnter={() => handleWidgetHover('revenue')}
                onMouseLeave={handleWidgetLeave}
                onClick={() => setActiveTab('revenue')}
              >
                <h3>Revenue</h3>
                <p className="stat-number">$2.4M</p>
                <p className="stat-change positive">+12% this month</p>
                {hoveredWidget === 'revenue' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('revenue')}>View Details</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card clickable"
                onMouseEnter={() => handleWidgetHover('adr')}
                onMouseLeave={handleWidgetLeave}
                onClick={() => setActiveTab('adr-reports')}
              >
                <h3>ADR Reports</h3>
                <p className="stat-number">$189</p>
                <p className="stat-change positive">+8% this month</p>
                {hoveredWidget === 'adr' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('adr-reports')}>View Details</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card clickable"
                onMouseEnter={() => handleWidgetHover('revpar')}
                onMouseLeave={handleWidgetLeave}
                onClick={() => setActiveTab('adr-vs-revpar')}
              >
                <h3>ADR vs RevPAR</h3>
                <p className="stat-number">$164</p>
                <p className="stat-change positive">+6% this month</p>
                {hoveredWidget === 'revpar' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('adr-vs-revpar')}>View Details</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card"
                onMouseEnter={() => handleWidgetHover('satisfaction')}
                onMouseLeave={handleWidgetLeave}
              >
                <h3>Guest Satisfaction</h3>
                <p className="stat-number">4.8/5</p>
                <p className="stat-change positive">+0.2 this month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adr-reports' && (
          <div className="dashboard-content">
            <h2>ADR Reports Dashboard</h2>
            
            <div className="charts-grid">
              <div className="chart-section">
                <h3>ADR Trend Analysis</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [189, 195, 182, 198, 205, 212],
                    comparisonValues: [175, 180, 178, 185, 190, 195]
                  }}
                  title="ADR Trends (6 Months)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Competitive ADR Analysis</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['Your Hotel', 'Competitor A', 'Competitor B', 'Competitor C', 'Market Avg'],
                    values: [189, 175, 182, 168, 178],
                    comparisonValues: [195, 180, 185, 172, 182]
                  }}
                  title="ADR Comparison"
                  height={300}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'occupancy-rate' && (
          <div className="dashboard-content">
            <h2>Occupancy Rate Dashboard</h2>
            
            <div className="charts-grid">
              <div className="chart-section">
                <h3>Occupancy Trend Analysis</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [87, 82, 89, 91, 88, 92],
                    comparisonValues: [82, 78, 85, 88, 85, 89]
                  }}
                  title="Occupancy Rate Trends (6 Months)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Competitive Occupancy Analysis</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['Your Hotel', 'Competitor A', 'Competitor B', 'Competitor C', 'Market Avg'],
                    values: [87, 82, 85, 79, 83],
                    comparisonValues: [92, 88, 90, 84, 87]
                  }}
                  title="Occupancy Rate Comparison"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Occupancy Prediction</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    values: [94, 96, 89, 85, 88, 95],
                    comparisonValues: [90, 92, 86, 82, 85, 92]
                  }}
                  title="Occupancy Forecast (6 Months)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Occupancy Index</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    values: [1.05, 0.98, 1.12, 1.08],
                    comparisonValues: [1.02, 0.95, 1.08, 1.05]
                  }}
                  title="Occupancy Index (Current Month)"
                  height={300}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adr-vs-revpar' && (
          <div className="dashboard-content">
            <h2>ADR vs RevPAR Dashboard</h2>
            
            <div className="charts-grid">
              <div className="chart-section">
                <h3>ADR vs RevPAR Trend Analysis</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [164, 160, 162, 180, 180, 195],
                    comparisonValues: [189, 195, 182, 198, 205, 212]
                  }}
                  title="ADR vs RevPAR Trends (6 Months)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>ADR vs RevPAR Comparison</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['Your Hotel', 'Competitor A', 'Competitor B', 'Competitor C', 'Market Avg'],
                    values: [164, 144, 155, 133, 147],
                    comparisonValues: [189, 175, 182, 168, 178]
                  }}
                  title="ADR vs RevPAR Comparison"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>RevPAR Efficiency Ratio</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [0.87, 0.82, 0.89, 0.91, 0.88, 0.92],
                    comparisonValues: [0.82, 0.78, 0.85, 0.88, 0.85, 0.89]
                  }}
                  title="RevPAR Efficiency (RevPAR/ADR)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Performance Metrics</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['ADR', 'RevPAR', 'Occupancy Rate', 'Efficiency'],
                    values: [189, 164, 87, 0.87],
                    comparisonValues: [195, 180, 92, 0.92]
                  }}
                  title="Key Performance Indicators"
                  height={300}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="dashboard-content">
            <h2>Revenue Dashboard</h2>
            
            <div className="charts-grid">
              <div className="chart-section">
                <h3>Revenue Trend Analysis</h3>
                <ChartComponent 
                  type="line"
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [2400000, 2520000, 2380000, 2640000, 2720000, 2800000],
                    comparisonValues: [2200000, 2300000, 2250000, 2400000, 2450000, 2500000]
                  }}
                  title="Revenue Trends (6 Months)"
                  height={300}
                />
              </div>
              
              <div className="chart-section">
                <h3>Revenue by Segment</h3>
                <ChartComponent 
                  type="bar"
                  data={{
                    labels: ['Room Revenue', 'F&B Revenue', 'Spa Revenue', 'Other Revenue'],
                    values: [1800000, 600000, 200000, 200000],
                    comparisonValues: [1700000, 550000, 180000, 180000]
                  }}
                  title="Revenue Breakdown"
                  height={300}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            {renderSettingsTab()}
            {showSuccessMessage && (
              <div className="success-message">Settings saved successfully!</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
  }
 
export default Dashboard; 