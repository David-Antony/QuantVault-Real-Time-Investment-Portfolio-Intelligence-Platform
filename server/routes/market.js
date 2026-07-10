const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { authenticate } = require('../middleware/auth');

router.get('/search', authenticate, marketController.searchSymbols);

module.exports = router;
