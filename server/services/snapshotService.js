/**
 * Portfolio Snapshot Service
 * - Takes a daily snapshot of every user's portfolio value
 * - Runs via node-cron every night at midnight
 * - Also exposes a manual takeSnapshot() for testing
 */
const cron = require('node-cron');
const { prisma } = require('../config/db');

const takeSnapshot = async () => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: { assets: true }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const portfolio of portfolios) {
      const assetValue = portfolio.assets.reduce(
        (sum, a) => sum + Number(a.currentPrice) * Number(a.quantity),
        0
      );
      const totalInvested = portfolio.assets.reduce(
        (sum, a) => sum + Number(a.totalInvested),
        0
      );
      const cashBalance = Number(portfolio.cashBalance);
      const totalValue = assetValue + cashBalance;
      const totalGainLoss = assetValue - totalInvested;

      // upsert — safe to run multiple times per day
      await prisma.portfolioSnapshot.upsert({
        where: { portfolioId_date: { portfolioId: portfolio.id, date: today } },
        update: { totalValue, cashBalance, totalGainLoss },
        create: { portfolioId: portfolio.id, totalValue, cashBalance, totalGainLoss, date: today }
      });
    }

    console.log(`[Snapshot] Saved ${portfolios.length} portfolio snapshot(s) for ${today.toISOString().split('T')[0]}`);
  } catch (err) {
    console.error('[Snapshot] Error taking snapshot:', err.message);
  }
};

const initSnapshotCron = () => {
  // Every day at 00:01 local time
  cron.schedule('1 0 * * *', () => {
    console.log('[Snapshot] Running daily snapshot cron...');
    takeSnapshot();
  });
  console.log('[Snapshot] Daily snapshot cron initialised (00:01 daily)');

  // Take one immediately on startup so the chart works from day 1
  takeSnapshot();
};

module.exports = { takeSnapshot, initSnapshotCron };
