const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { authenticate, requireAdmin } = require('../middleware/auth');
const ApiError = require('../utils/ApiError');

// Protected admin routes
router.use(authenticate, requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide platform statistics
 * @access  Private/Admin
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    
    // Total portfolios and assets
    const totalPortfolios = await prisma.portfolio.count();
    const totalAssets = await prisma.portfolioAsset.count();

    // Aggregating total transaction volume
    const transactionAggregate = await prisma.transaction.aggregate({
      _sum: { amount: true }
    });
    const totalTransactionVolume = transactionAggregate._sum.amount || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPortfolios,
        totalAssets,
        totalTransactionVolume: parseFloat(totalTransactionVolume.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
