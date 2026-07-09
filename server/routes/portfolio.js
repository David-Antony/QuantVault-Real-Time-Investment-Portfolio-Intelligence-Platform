const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const portfolioController = require('../controllers/portfolioController');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.use(authenticate);

const transactionValidation = [
  body('assetName')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required'),
  body('type')
    .isIn(['buy', 'sell', 'dividend', 'interest'])
    .withMessage('Type must be buy, sell, dividend, or interest'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('price')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('quantity')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required')
];

const { getMarketNews } = require('../controllers/newsController');

router.get('/', portfolioController.getPortfolio);
router.get('/news', getMarketNews);
router.get('/analytics', getAnalytics);
router.get('/analytics/indicators', portfolioController.getTechnicalIndicators);
router.get('/history', portfolioController.getPortfolioHistory);
router.get('/history/benchmark', portfolioController.getBenchmarkHistory);
router.get('/transactions', portfolioController.getTransactions);
router.post('/transactions', validate(transactionValidation), portfolioController.createTransaction);
router.post('/transactions/import-csv', portfolioController.importTransactionsCSV);
router.delete('/transactions/:id', portfolioController.deleteTransaction);
router.get('/export/csv', portfolioController.exportCSV);
router.get('/export', portfolioController.exportPortfolio);
router.delete('/clear', portfolioController.clearAllTransactions);

module.exports = router;
