// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});

module.exports = (app) => {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
  // Enable CORS
  app.use(cors());
  
  // Request logging
  app.use(morgan('dev'));
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));
  
  // Compress responses
  app.use(compression());
  
  // Apply rate limiting to API routes
  app.use('/api/', apiLimiter);
  
  // Routes API
  app.use('/api/auth', require('../routes/auth'));
  app.use('/api/users', require('../routes/users'));
  app.use('/api/products', require('../routes/products'));
  app.use('/api/categories', require('../routes/categories'));
  app.use('/api/panier', require('../routes/panier'));
  app.use('/api/orders', require('../routes/orders'));
  app.use('/api/contacts', require('../routes/contacts'));
  app.use('/api/reviews', require('../routes/reviews'));
  app.use('/api/favorites', require('../routes/favorites'));
  app.use('/api/code-promos', require('../routes/code-promos'));
  app.use('/api/flash-sales', require('../routes/flash-sales'));
  app.use('/api/client-chat', require('../routes/client-chat'));
  app.use('/api/admin-chat', require('../routes/admin-chat'));
  app.use('/api/visitors', require('../routes/visitors'));
  app.use('/api/pub-layout', require('../routes/pub-layout'));
  app.use('/api/remboursements', require('../routes/remboursements'));
  app.use('/api/settings', require('../routes/settings'));
  app.use('/api/maintenance', require('../routes/maintenance'));
  app.use('/api/sales-notifications', require('../routes/sales-notifications'));
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../../build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
  });
};
