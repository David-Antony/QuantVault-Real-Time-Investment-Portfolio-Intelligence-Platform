const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const profileRoutes = require('./routes/profile');
const alertRoutes = require('./routes/alerts');
const auditRoutes = require('./routes/audit');
const watchlistRoutes = require('./routes/watchlist');
const twoFactorRoutes = require('./routes/twoFactor');
const reportsRoutes = require('./routes/reports');
const marketRoutes = require('./routes/market');
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

app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "QuantVault API Documentation"
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'QuantVault API is running',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/portfolio', apiLimiter, portfolioRoutes);
app.use('/api/profile', apiLimiter, profileRoutes);
app.use('/api/alerts', apiLimiter, alertRoutes);
app.use('/api/audit', apiLimiter, auditRoutes);
app.use('/api/watchlist', apiLimiter, watchlistRoutes);
app.use('/api/auth/2fa', apiLimiter, twoFactorRoutes);
app.use('/api/reports', apiLimiter, reportsRoutes);
app.use('/api/market', apiLimiter, marketRoutes);

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }

  // Pages that do NOT require authentication (public)
  const publicPages = ['login.html', 'signup.html'];

  // All authenticated pages
  const protectedPages = [
    'index.html', 'portfolio.html', 'transactions.html',
    'reports.html', 'profile.html', 'alerts.html', 'watchlist.html'
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

  // Root '/' and any unknown path → redirect to login
  res.redirect('/login.html');
});

app.use(errorHandler);

module.exports = app;
