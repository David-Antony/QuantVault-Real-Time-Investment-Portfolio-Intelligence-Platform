const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { authenticate } = require('../middleware/auth');

/**
 * Market Data Routes
 * Handles proxy requests to third-party financial APIs (e.g., Yahoo Finance).
 */
router.get('/search', authenticate, marketController.searchSymbols);

module.exports = router;
