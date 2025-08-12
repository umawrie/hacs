const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration and Settings
const config = {
  app: {
    name: 'HACS Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  server: {
    port: PORT,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  },
  features: {
    analytics: true,
    reporting: true,
    userManagement: true,
    notifications: true
  },
  limits: {
    maxFileSize: '10MB',
    maxRequestsPerMinute: 100,
    sessionTimeout: 3600000 // 1 hour
  }
};

// Settings Management
let userSettings = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  dashboard: {
    defaultView: 'overview',
    refreshInterval: 30000, // 30 seconds
    showCharts: true,
    showMetrics: true
  },
  analytics: {
    dateRange: '30d',
    includeHistorical: true,
    exportFormat: 'csv'
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: `${config.app.name} is running`,
    version: config.app.version,
    environment: config.app.environment,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    app: config.app,
    server: {
      port: config.server.port,
      host: config.server.host
    },
    features: config.features,
    limits: config.limits
  });
});

app.get('/api/settings', (req, res) => {
  res.json(userSettings);
});

app.put('/api/settings', (req, res) => {
  try {
    const updates = req.body;
    
    // Validate settings updates
    if (updates.theme && !['light', 'dark', 'auto'].includes(updates.theme)) {
      return res.status(400).json({ error: 'Invalid theme value' });
    }
    
    if (updates.language && !['en', 'es', 'fr', 'de'].includes(updates.language)) {
      return res.status(400).json({ error: 'Invalid language value' });
    }
    
    // Update settings
    userSettings = { ...userSettings, ...updates };
    
    res.json({
      message: 'Settings updated successfully',
      settings: userSettings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.get('/api/analytics', (req, res) => {
  // Mock analytics data
  const analyticsData = {
    occupancyRate: 85.5,
    revenue: 1250000,
    adrReports: 150.75,
    adrVsRevpar: 128.5,
    guestSatisfaction: 4.2,
    lastUpdated: new Date().toISOString(),
    dataSource: 'mock'
  };
  
  res.json(analyticsData);
});

app.get('/api/reports', (req, res) => {
  const reports = [
    {
      id: 1,
      name: 'Monthly Revenue Report',
      type: 'revenue',
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Occupancy Analysis',
      type: 'occupancy',
      status: 'pending',
      lastGenerated: null,
      format: 'CSV'
    },
    {
      id: 3,
      name: 'ADR vs RevPAR Comparison',
      type: 'comparison',
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      format: 'Excel'
    }
  ];
  
  res.json(reports);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: config.app.environment === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ${config.app.name} v${config.app.version} running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.app.environment}`);
  console.log(`🔧 Features enabled: ${Object.keys(config.features).filter(k => config.features[k]).join(', ')}`);
  console.log(`📊 Server ready at http://localhost:${PORT}`);
}); 