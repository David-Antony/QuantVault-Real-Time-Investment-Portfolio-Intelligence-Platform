const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAuditLog } = require('../controllers/auditController');

const router = express.Router();
router.use(authenticate);
router.get('/', getAuditLog);

module.exports = router;
