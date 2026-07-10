const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { requireAuth } = require('../middleware/auth');

router.get('/search', requireAuth, marketController.searchSymbols);

module.exports = router;
