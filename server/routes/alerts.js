const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAlerts, createAlert, toggleAlert, deleteAlert } = require('../controllers/alertController');

const router = express.Router();
router.use(authenticate);

/**
 * Alert Routes
 * Handles CRUD operations for price and percentage alerts.
 * All routes require authentication.
 */
router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id/toggle', toggleAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
