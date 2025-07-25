import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [analyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);
  const analyticsDropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analyticsDropdownRef.current && !analyticsDropdownRef.current.contains(event.target)) {
        setAnalyticsDropdownOpen(false);
      }
    };

    if (analyticsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [analyticsDropdownOpen]);

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
            <span className="user-name">Welcome, User</span>
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
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={toggleAnalyticsDropdown}
            >
              Analytics
            </button>
            {analyticsDropdownOpen && (
              <div className="nav-dropdown" ref={analyticsDropdownRef}>
                <div 
                  className="dropdown-item"
                  onMouseEnter={() => setHoveredWidget('adr-submenu')}
                  onMouseLeave={() => setHoveredWidget(null)}
                >
                  ADR Reports
                  <span className="dropdown-arrow">▶</span>
                  {hoveredWidget === 'adr-submenu' && (
                    <div className="submenu">
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Trend Analysis</div>
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Competitive Analysis</div>
                      
                    </div>
                  )}
                </div>
                <div 
                  className="dropdown-item"
                  onMouseEnter={() => setHoveredWidget('revenue-submenu')}
                  onMouseLeave={() => setHoveredWidget(null)}
                >
                  Revenue
                  <span className="dropdown-arrow">▶</span>
                  {hoveredWidget === 'revenue-submenu' && (
                    <div className="submenu">
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Trend Analysis</div>
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Competitive Analysis</div>
        
                    </div>
                  )}
                </div>
                <div 
                  className="dropdown-item"
                  onMouseEnter={() => setHoveredWidget('revpar-submenu')}
                  onMouseLeave={() => setHoveredWidget(null)}
                >
                  ADR vs RevPAR
                  <span className="dropdown-arrow">▶</span>
                  {hoveredWidget === 'revpar-submenu' && (
                    <div className="submenu">
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Trend Analysis</div>
                      
                      <div className="submenu-item" onClick={() => navigateToTab('reports')}>Reports</div>
                    </div>
                  )}
                </div>
                <div 
                  className="dropdown-item"
                  onMouseEnter={() => setHoveredWidget('occupancy-submenu')}
                  onMouseLeave={() => setHoveredWidget(null)}
                >
                  Occupancy Rate
                  <span className="dropdown-arrow">▶</span>
                  {hoveredWidget === 'occupancy-submenu' && (
                    <div className="submenu">
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Trend Analysis</div>
                      <div className="submenu-item" onClick={() => navigateToTab('analytics')}>Competitive Analysis</div>
                      <div className="submenu-item" onClick={() => navigateToTab('reports')}>Occupancy Prediction</div>
                      <div className="submenu-item" onClick={() => navigateToTab('reports')}>Index</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
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
            <h2>Welcome back, John</h2>
            
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
                    <button onClick={() => navigateToTab('analytics')}>Trends Analysis</button>
                    <button onClick={() => navigateToTab('analytics')}>Competitive Analysis</button>
                    <button onClick={() => navigateToTab('reports')}>Occupancy Prediction</button>
                    <button onClick={() => navigateToTab('reports')}>Index</button>
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
                <p className="stat-change positive">+8% this month</p>
                {hoveredWidget === 'revenue' && (
                  <div className="widget-actions">
                    <button onClick={() => navigateToTab('analytics')}>Trend Analysis</button>
                    <button onClick={() => navigateToTab('analytics')}>Competitive Analysis</button>
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
                <p className="stat-change positive">+12% this month</p>
                {hoveredWidget === 'adr' && (
                  <div className="widget-actions">
                    <button onClick={() => navigateToTab('analytics')}>Trend Analysis</button>
                    <button onClick={() => navigateToTab('analytics')}>Competitive Analysis</button>
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
                <p className="stat-change positive">+7% this month</p>
                {hoveredWidget === 'revpar' && (
                  <div className="widget-actions">
                    <button onClick={() => navigateToTab('analytics')}>Trend Analysis</button>
                    <button onClick={() => navigateToTab('reports')}>Reports</button>
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
            <h2>Analytics</h2>
            <p>Hover over the Analytics tab in the navigation to see available metrics.</p>
            <div className="placeholder-content">
              <p>Select a metric from the dropdown to view detailed analytics.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="dashboard-content">
            <h2>Reports</h2>
            <p>Generate and view detailed reports for your properties.</p>
            <div className="placeholder-content">
              <p>Reports section coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <h2>Settings</h2>
            <p>Manage your account and system preferences.</p>
            <div className="placeholder-content">
              <p>Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard; 