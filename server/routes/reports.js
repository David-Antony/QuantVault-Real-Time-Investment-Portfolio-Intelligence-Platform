const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { getPortfolioInsights, getMonteCarloForecast } = require('../controllers/insightsController');
const { authenticate } = require('../middleware/auth');

/**
 * Reports and Insights Routes
 * Handles PDF generation, portfolio insights, and Monte Carlo forecasts.
 */
router.get('/pdf', authenticate, generatePDF);
router.get('/insights', authenticate, getPortfolioInsights);
router.get('/forecast', authenticate, getMonteCarloForecast);

module.exports = router;
