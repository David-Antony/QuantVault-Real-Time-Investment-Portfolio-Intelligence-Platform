const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { authenticate } = require('../middleware/auth');

router.get('/pdf', authenticate, generatePDF);

module.exports = router;
