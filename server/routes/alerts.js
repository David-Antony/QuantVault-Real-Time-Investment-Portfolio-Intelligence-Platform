const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getAlerts, createAlert, toggleAlert, deleteAlert } = require('../controllers/alertController');

const router = express.Router();
router.use(authenticate);

router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id/toggle', toggleAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
