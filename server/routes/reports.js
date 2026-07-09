const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { getPortfolioInsights } = require('../controllers/insightsController');
const { authenticate } = require('../middleware/auth');

router.get('/pdf', authenticate, generatePDF);
router.get('/insights', authenticate, getPortfolioInsights);

module.exports = router;
