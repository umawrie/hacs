import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [analyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@hacs.com',
      profilePhoto: null
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

  const handleSettingsChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    // Auto-save after each change
    setTimeout(() => {
      saveSettings();
    }, 500);
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        setShowSuccessMessage(true);
        
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
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleSettingsChange('profile', 'profilePhoto', e.target.files[0])}
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

  const handleLogout = () => {
    // In a real app, you'd clear authentication tokens here
    onLogout();
  };

  const handleWidgetHover = (widgetId) => {
    setHoveredWidget(widgetId);
  };

  const handleWidgetLeave = () => {
    setHoveredWidget(null);
  };

  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    setAnalyticsDropdownOpen(false);
  };

  const toggleAnalyticsDropdown = () => {
    setAnalyticsDropdownOpen(!analyticsDropdownOpen);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/NEWHACSLogo.jpg" alt="HACS Logo" className="header-logo" />
          <h1>Hospitality Analytics Cloud Services</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{settings.profile.firstName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
              className={`nav-tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={toggleAnalyticsDropdown}
            >
              Resources
            </button>
            {analyticsDropdownOpen && (
              <div className="nav-dropdown" ref={analyticsDropdownRef}>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('analytics');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  Analytics
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('reports');
                    setAnalyticsDropdownOpen(false);
                  }}
                >
                  Reports
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
            <h2>Welcome back, {settings.profile.firstName} {settings.profile.lastName}</h2>
            
            <div className="stats-grid">
              <div 
                className="stat-card"
                onMouseEnter={() => handleWidgetHover('occupancy')}
                onMouseLeave={handleWidgetLeave}
              >
                <h3>Occupancy Rate</h3>
                <p className="stat-number">87%</p>
                <p className="stat-change positive">+5% this month</p>
                {hoveredWidget === 'occupancy' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button onClick={() => setActiveTab('reports')}>Reports</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card"
                onMouseEnter={() => handleWidgetHover('revenue')}
                onMouseLeave={handleWidgetLeave}
              >
                <h3>Revenue</h3>
                <p className="stat-number">$2.4M</p>
                <p className="stat-change positive">+12% this month</p>
                {hoveredWidget === 'revenue' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button onClick={() => setActiveTab('reports')}>Reports</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card"
                onMouseEnter={() => handleWidgetHover('adr')}
                onMouseLeave={handleWidgetLeave}
              >
                <h3>ADR Reports</h3>
                <p className="stat-number">$189</p>
                <p className="stat-change positive">+8% this month</p>
                {hoveredWidget === 'adr' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button onClick={() => setActiveTab('reports')}>Reports</button>
                  </div>
                )}
              </div>
              <div 
                className="stat-card"
                onMouseEnter={() => handleWidgetHover('revpar')}
                onMouseLeave={handleWidgetLeave}
              >
                <h3>ADR vs RevPAR</h3>
                <p className="stat-number">$164</p>
                <p className="stat-change positive">+6% this month</p>
                {hoveredWidget === 'revpar' && (
                  <div className="widget-actions">
                    <button onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button onClick={() => setActiveTab('reports')}>Reports</button>
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

        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <h2>Analytics Dashboard</h2>
            <p>Comprehensive analytics and insights for your hospitality metrics</p>
            
            <div className="metrics-grid">
              <div className="metric-section">
                <h3>ADR Reports Analytics</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Trend Analysis</h4>
                    <p>Analyze ADR trends over time and identify patterns</p>
                    <button className="metric-btn">View Trends</button>
                  </div>
                  <div className="metric-card">
                    <h4>Competitive Analysis</h4>
                    <p>Compare your ADR performance against competitors</p>
                    <button className="metric-btn">Compare</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>Revenue Analytics</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Revenue Trends</h4>
                    <p>Track revenue growth and seasonal patterns</p>
                    <button className="metric-btn">View Trends</button>
                  </div>
                  <div className="metric-card">
                    <h4>Revenue Forecasting</h4>
                    <p>Predict future revenue based on historical data</p>
                    <button className="metric-btn">Forecast</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>ADR vs RevPAR Analytics</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Performance Comparison</h4>
                    <p>Analyze the relationship between ADR and RevPAR</p>
                    <button className="metric-btn">Compare</button>
                  </div>
                  <div className="metric-card">
                    <h4>Optimization Insights</h4>
                    <p>Identify opportunities to improve RevPAR</p>
                    <button className="metric-btn">Optimize</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>Occupancy Rate Analytics</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Occupancy Trends</h4>
                    <p>Track occupancy patterns and seasonal variations</p>
                    <button className="metric-btn">View Trends</button>
                  </div>
                  <div className="metric-card">
                    <h4>Capacity Planning</h4>
                    <p>Optimize room availability and pricing strategies</p>
                    <button className="metric-btn">Plan</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="dashboard-content">
            <h2>Reports Dashboard</h2>
            <p>Generate comprehensive reports and insights for your hospitality operations</p>
            
            <div className="metrics-grid">
              <div className="metric-section">
                <h3>ADR Reports</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Monthly ADR Report</h4>
                    <p>Comprehensive monthly ADR performance summary</p>
                    <button className="metric-btn">Generate Report</button>
                  </div>
                  <div className="metric-card">
                    <h4>ADR Performance Analysis</h4>
                    <p>Detailed analysis of ADR performance metrics</p>
                    <button className="metric-btn">View Analysis</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>Revenue Reports</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Revenue Summary Report</h4>
                    <p>Monthly revenue summary and breakdown</p>
                    <button className="metric-btn">Generate Report</button>
                  </div>
                  <div className="metric-card">
                    <h4>Revenue Growth Report</h4>
                    <p>Track revenue growth and performance trends</p>
                    <button className="metric-btn">View Growth</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>ADR vs RevPAR Reports</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Performance Comparison Report</h4>
                    <p>Compare ADR and RevPAR performance</p>
                    <button className="metric-btn">Generate Report</button>
                  </div>
                  <div className="metric-card">
                    <h4>Optimization Report</h4>
                    <p>Identify RevPAR optimization opportunities</p>
                    <button className="metric-btn">View Report</button>
                  </div>
                </div>
              </div>
              
              <div className="metric-section">
                <h3>Occupancy Reports</h3>
                <div className="metric-content">
                  <div className="metric-card">
                    <h4>Occupancy Summary Report</h4>
                    <p>Monthly occupancy performance summary</p>
                    <button className="metric-btn">Generate Report</button>
                  </div>
                  <div className="metric-card">
                    <h4>Occupancy Prediction Report</h4>
                    <p>Forecast future occupancy rates</p>
                    <button className="metric-btn">View Prediction</button>
                  </div>
                </div>
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