const express = require('express');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./auth');
const portfolioRoutes = require('./portfolio');
const profileRoutes = require('./profile');
const alertRoutes = require('./alerts');
const auditRoutes = require('./audit');
const watchlistRoutes = require('./watchlist');
const twoFactorRoutes = require('./twoFactor');
const reportsRoutes = require('./reports');
const marketRoutes = require('./market');
const adminRoutes = require('./admin');

const router = express.Router();

// Rate limiters for security and DoS protection
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

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'QuantVault API is running',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Feature Routers
 */
router.use('/auth', authLimiter, authRoutes);
router.use('/portfolio', apiLimiter, portfolioRoutes);
router.use('/profile', apiLimiter, profileRoutes);
router.use('/alerts', apiLimiter, alertRoutes);
router.use('/audit', apiLimiter, auditRoutes);
router.use('/watchlist', apiLimiter, watchlistRoutes);
router.use('/auth/2fa', apiLimiter, twoFactorRoutes);
router.use('/reports', apiLimiter, reportsRoutes);
router.use('/market', apiLimiter, marketRoutes);
router.use('/admin', apiLimiter, adminRoutes);

module.exports = router;
