const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3002',
  credentials: true
}));

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "QuantVault API Documentation"
}));

// Consolidated API routes
app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }

  // Pages that do NOT require authentication (public)
  const publicPages = ['login.html', 'signup.html'];

  // All authenticated pages
  const protectedPages = [
    'index.html', 'portfolio.html', 'transactions.html',
    'reports.html', 'profile.html', 'alerts.html', 'watchlist.html', 'admin.html'
  ];

  const requestedPage = req.path.replace(/^\//, '');

  // Serve public pages directly
  if (publicPages.includes(requestedPage)) {
    return res.sendFile(path.join(__dirname, '..', 'public', requestedPage));
  }

  // Serve protected pages (client-side auth guard in auth.js will redirect if not logged in)
  if (protectedPages.includes(requestedPage)) {
    return res.sendFile(path.join(__dirname, '..', 'public', requestedPage));
  }

  // Root '/' -> serve index.html (auth.js handles redirect to login.html if not logged in)
  if (requestedPage === '') {
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }

  // Any other unknown path -> 404
  res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

app.use(errorHandler);

module.exports = app;
