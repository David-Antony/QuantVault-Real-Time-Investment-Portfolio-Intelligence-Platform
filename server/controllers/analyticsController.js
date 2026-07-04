const { prisma } = require('../config/db');

/**
 * Compute advanced portfolio analytics from existing portfolio data.
 * All calculations are done server-side from existing assets & transactions.
 */
const getAnalytics = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: {
        assets: true,
        transactions: { orderBy: { date: 'asc' } }
      }
    });

    if (!portfolio) {
      return res.json({ success: true, data: _emptyAnalytics() });
    }

    const assets = portfolio.assets.map((a) => ({
      name: a.name,
      currentPrice: Number(a.currentPrice),
      quantity: Number(a.quantity),
      averageCost: Number(a.averageCost),
      totalInvested: Number(a.totalInvested),
      currentValue: Number(a.currentPrice) * Number(a.quantity),
      gainLoss: Number(a.currentPrice) * Number(a.quantity) - Number(a.totalInvested),
      gainLossPct:
        Number(a.totalInvested) > 0
          ? ((Number(a.currentPrice) * Number(a.quantity) - Number(a.totalInvested)) /
              Number(a.totalInvested)) *
            100
          : 0
    }));

    const transactions = portfolio.transactions;
    const cashBalance = Number(portfolio.cashBalance);
    const totalAssetValue = assets.reduce((s, a) => s + a.currentValue, 0);
    const totalValue = totalAssetValue + cashBalance;
    const totalInvested = assets.reduce((s, a) => s + a.totalInvested, 0);

    // --- Win Rate ---
    const winningAssets = assets.filter((a) => a.gainLoss > 0).length;
    const winRate = assets.length > 0 ? (winningAssets / assets.length) * 100 : 0;

    // --- Best & Worst Performer ---
    const sorted = [...assets].sort((a, b) => b.gainLossPct - a.gainLossPct);
    const bestPerformer = sorted[0] || null;
    const worstPerformer = sorted[sorted.length - 1] || null;

    // --- Monthly Returns from transactions (for Sharpe & Volatility) ---
    const monthlyReturns = _computeMonthlyReturns(transactions, 100000);

    // --- Volatility (std deviation of monthly returns %) ---
    const volatility = _stdDev(monthlyReturns);

    // --- Sharpe Ratio (assume risk-free rate = 0.5% / month = ~6% annual) ---
    const RISK_FREE_MONTHLY = 0.005;
    const meanReturn = monthlyReturns.length > 0
      ? monthlyReturns.reduce((s, r) => s + r, 0) / monthlyReturns.length
      : 0;
    const sharpeRatio = volatility > 0
      ? ((meanReturn - RISK_FREE_MONTHLY) / volatility).toFixed(2)
      : 'N/A';

    // --- Max Drawdown from transaction-derived cumulative values ---
    const drawdown = _maxDrawdown(transactions, 100000);

    // --- Diversification Score (0–100, higher = more diversified) ---
    const diversificationScore = _diversificationScore(assets, totalValue);

    // --- Total transactions breakdown ---
    const txBreakdown = {
      total: transactions.length,
      buy: transactions.filter((t) => t.type === 'buy').length,
      sell: transactions.filter((t) => t.type === 'sell').length,
      dividend: transactions.filter((t) => t.type === 'dividend').length,
      interest: transactions.filter((t) => t.type === 'interest').length
    };

    // --- Total dividends + interest received ---
    const passiveIncome = transactions
      .filter((t) => t.type === 'dividend' || t.type === 'interest')
      .reduce((s, t) => s + Number(t.amount), 0);

    res.json({
      success: true,
      data: {
        totalValue: Math.round(totalValue * 100) / 100,
        totalInvested: Math.round(totalInvested * 100) / 100,
        totalGainLoss: Math.round((totalValue - totalInvested - cashBalance + cashBalance - totalInvested) * 100) / 100,
        overallReturn: totalInvested > 0
          ? Math.round(((totalAssetValue - totalInvested) / totalInvested) * 10000) / 100
          : 0,
        winRate: Math.round(winRate * 10) / 10,
        winningAssets,
        totalAssets: assets.length,
        bestPerformer: bestPerformer
          ? { name: bestPerformer.name, returnPct: Math.round(bestPerformer.gainLossPct * 100) / 100 }
          : null,
        worstPerformer: worstPerformer && assets.length > 1
          ? { name: worstPerformer.name, returnPct: Math.round(worstPerformer.gainLossPct * 100) / 100 }
          : null,
        volatility: Math.round(volatility * 10000) / 100, // as %
        sharpeRatio,
        maxDrawdown: Math.round(drawdown * 100) / 100,
        diversificationScore: Math.round(diversificationScore),
        passiveIncome: Math.round(passiveIncome * 100) / 100,
        txBreakdown,
        monthlyReturnsCount: monthlyReturns.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Helpers ---

function _emptyAnalytics() {
  return {
    totalValue: 0, totalInvested: 0, totalGainLoss: 0, overallReturn: 0,
    winRate: 0, winningAssets: 0, totalAssets: 0,
    bestPerformer: null, worstPerformer: null,
    volatility: 0, sharpeRatio: 'N/A', maxDrawdown: 0,
    diversificationScore: 0, passiveIncome: 0,
    txBreakdown: { total: 0, buy: 0, sell: 0, dividend: 0, interest: 0 },
    monthlyReturnsCount: 0
  };
}

function _computeMonthlyReturns(transactions, startingCash) {
  // Group net cash flow by month
  const map = new Map();
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const sign = (t.type === 'sell' || t.type === 'dividend' || t.type === 'interest') ? 1 : -1;
    map.set(key, (map.get(key) || 0) + sign * Number(t.amount));
  });

  const keys = [...map.keys()].sort();
  const returns = [];
  let prev = startingCash;
  keys.forEach((k) => {
    const curr = prev + (map.get(k) || 0);
    if (prev > 0) returns.push((curr - prev) / prev);
    prev = curr;
  });
  return returns;
}

function _stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function _maxDrawdown(transactions, startingCash) {
  if (transactions.length === 0) return 0;
  // Build cumulative value timeline
  const map = new Map();
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const sign = (t.type === 'sell' || t.type === 'dividend' || t.type === 'interest') ? 1 : -1;
    map.set(key, (map.get(key) || 0) + sign * Number(t.amount));
  });
  const keys = [...map.keys()].sort();
  let value = startingCash;
  let peak = startingCash;
  let maxDD = 0;
  keys.forEach((k) => {
    value += map.get(k) || 0;
    if (value > peak) peak = value;
    const dd = peak > 0 ? ((peak - value) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  });
  return maxDD;
}

function _diversificationScore(assets, totalValue) {
  if (assets.length === 0 || totalValue <= 0) return 0;
  // Shannon entropy-based score, normalised to 0–100
  const weights = assets.map((a) => a.currentValue / totalValue).filter((w) => w > 0);
  if (weights.length === 0) return 0;
  const entropy = -weights.reduce((s, w) => s + w * Math.log(w), 0);
  const maxEntropy = Math.log(assets.length);
  return maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;
}

module.exports = { getAnalytics };
