const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAuditLog } = require('../controllers/auditController');

const router = express.Router();
router.use(authenticate);

/**
 * Audit Log Routes
 * Handles retrieval of user activity logs.
 */
router.get('/', getAuditLog);

module.exports = router;
