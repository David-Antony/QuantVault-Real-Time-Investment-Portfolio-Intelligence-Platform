const express = require('express');
const router = express.Router();
const { setup2FA, verify2FA, disable2FA, get2FAStatus } = require('../controllers/twoFactorController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

/**
 * Two-Factor Authentication Routes
 * Handles setup, verification, and disabling of 2FA.
 */
router.get('/status', get2FAStatus);
router.post('/setup', setup2FA);
router.post('/verify', verify2FA);
router.post('/disable', disable2FA);

module.exports = router;
