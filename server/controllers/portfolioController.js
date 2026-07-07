const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { logAudit } = require('../utils/auditLogger');

const getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: {
        assets: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 50
        }
      }
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: req.userId,
          cashBalance: 100000.00
        },
        include: {
          assets: true,
          transactions: {
            orderBy: { date: 'desc' },
            take: 50
          }
        }
      });
    }

    const assets = portfolio.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      currentPrice: Number(asset.currentPrice),
      quantity: Number(asset.quantity),
      averageCost: Number(asset.averageCost),
      totalInvested: Number(asset.totalInvested),
      gainLoss: Number(asset.currentPrice) * Number(asset.quantity) - Number(asset.totalInvested),
      gainLossPercentage:
        Number(asset.totalInvested) > 0
          ? ((Number(asset.currentPrice) * Number(asset.quantity) - Number(asset.totalInvested)) /
              Number(asset.totalInvested)) *
            100
          : 0
    }));

    const totalValue =
      assets.reduce((sum, a) => sum + Number(a.currentPrice) * Number(a.quantity), 0) +
      Number(portfolio.cashBalance);

    const totalInvested = assets.reduce((sum, a) => sum + Number(a.totalInvested), 0);

    const totalGainLoss = assets.reduce((sum, a) => sum + a.gainLoss, 0);

    const assetAllocation = {};
    assets.forEach((asset) => {
      const value = Number(asset.currentPrice) * Number(asset.quantity);
      if (value > 0) {
        assetAllocation[asset.name] = {
          type: asset.type,
          value: Math.round(value * 100) / 100,
          percentage: totalValue > 0 ? Math.round((value / totalValue) * 10000) / 100 : 0
        };
      }
    });

    res.json({
      success: true,
      data: {
        id: portfolio.id,
        name: portfolio.name,
        cashBalance: Number(portfolio.cashBalance),
        assets,
        assetAllocation,
        totalInvested: Math.round(totalInvested * 100) / 100,
        totalValue: Math.round(totalValue * 100) / 100,
        totalGainLoss: Math.round(totalGainLoss * 100) / 100,
        totalGainLossPercentage:
          totalInvested > 0 ? Math.round((totalGainLoss / totalInvested) * 10000) / 100 : 0,
        transactions: portfolio.transactions.map((t) => ({
          id: t.id,
          assetName: t.assetName,
          type: t.type,
          amount: Number(t.amount),
          price: t.price ? Number(t.price) : null,
          quantity: t.quantity ? Number(t.quantity) : null,
          status: t.status,
          date: t.date
        })),
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId }
    });

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found');
    }

    const transactions = await prisma.transaction.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: transactions.map((t) => ({
        id: t.id,
        assetName: t.assetName,
        type: t.type,
        amount: Number(t.amount),
        price: t.price ? Number(t.price) : null,
        quantity: t.quantity ? Number(t.quantity) : null,
        status: t.status,
        date: t.date,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { assetName, type, amount, price, quantity, date } = req.body;

    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: { assets: true }
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: req.userId,
          cashBalance: 100000.00
        },
        include: { assets: true }
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        portfolioId: portfolio.id,
        assetName,
        type,
        amount,
        price: price || null,
        quantity: quantity || null,
        date: new Date(date)
      }
    });

    let newCashBalance = Number(portfolio.cashBalance);

    if (type === 'buy') {
      newCashBalance -= Number(amount);
      let existingAsset = portfolio.assets.find((a) => a.name === assetName);

      if (existingAsset) {
        const newQuantity = Number(existingAsset.quantity) + Number(quantity || 0);
        const newTotalInvested = Number(existingAsset.totalInvested) + Number(amount);
        const newAverageCost = newQuantity > 0 ? newTotalInvested / newQuantity : 0;

        await prisma.asset.update({
          where: { id: existingAsset.id },
          data: {
            quantity: newQuantity,
            totalInvested: newTotalInvested,
            averageCost: newAverageCost,
            currentPrice: Number(price) || Number(existingAsset.currentPrice)
          }
        });
      } else {
        await prisma.asset.create({
          data: {
            portfolioId: portfolio.id,
            name: assetName,
            type: 'stock',
            currentPrice: Number(price) || 0,
            quantity: Number(quantity) || 0,
            averageCost: Number(quantity) > 0 ? Number(amount) / Number(quantity) : 0,
            totalInvested: Number(amount)
          }
        });
      }
    } else if (type === 'sell') {
      newCashBalance += Number(amount);
      const existingAsset = portfolio.assets.find((a) => a.name === assetName);

      if (existingAsset) {
        const newQuantity = Number(existingAsset.quantity) - Number(quantity || 0);

        if (newQuantity <= 0) {
          await prisma.asset.delete({ where: { id: existingAsset.id } });
        } else {
          const newTotalInvested =
            Number(existingAsset.totalInvested) -
            Number(existingAsset.averageCost) * Number(quantity || 0);

          await prisma.asset.update({
            where: { id: existingAsset.id },
            data: {
              quantity: newQuantity,
              totalInvested: Math.max(0, newTotalInvested),
              currentPrice: Number(price) || Number(existingAsset.currentPrice)
            }
          });
        }
      }
    } else if (type === 'dividend' || type === 'interest') {
      newCashBalance += Number(amount);
    }

    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: newCashBalance }
    });

    await logAudit(req.userId, `TRANSACTION_${type.toUpperCase()}`, { assetName, type, amount, quantity }, req);

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: {
        id: transaction.id,
        assetName: transaction.assetName,
        type: transaction.type,
        amount: Number(transaction.amount),
        price: transaction.price ? Number(transaction.price) : null,
        quantity: transaction.quantity ? Number(transaction.quantity) : null,
        status: transaction.status,
        date: transaction.date
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId }
    });

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found');
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
        portfolioId: portfolio.id
      }
    });

    if (!transaction) {
      throw ApiError.notFound('Transaction not found');
    }

    await prisma.transaction.delete({ where: { id: parseInt(id) } });

    await logAudit(req.userId, 'TRANSACTION_DELETE', { transactionId: parseInt(id) }, req);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const exportPortfolio = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: {
        assets: true,
        transactions: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found');
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      portfolio: {
        name: portfolio.name,
        cashBalance: Number(portfolio.cashBalance)
      },
      assets: portfolio.assets.map((a) => ({
        name: a.name,
        type: a.type,
        currentPrice: Number(a.currentPrice),
        quantity: Number(a.quantity),
        averageCost: Number(a.averageCost),
        totalInvested: Number(a.totalInvested)
      })),
      transactions: portfolio.transactions.map((t) => ({
        assetName: t.assetName,
        type: t.type,
        amount: Number(t.amount),
        price: t.price ? Number(t.price) : null,
        quantity: t.quantity ? Number(t.quantity) : null,
        date: t.date
      }))
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    next(error);
  }
};

const clearAllTransactions = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId }
    });

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found');
    }

    await prisma.transaction.deleteMany({
      where: { portfolioId: portfolio.id }
    });

    await prisma.asset.deleteMany({
      where: { portfolioId: portfolio.id }
    });

    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: 100000.00 }
    });

    res.json({
      success: true,
      message: 'All transactions cleared, portfolio reset'
    });
  } catch (error) {
    next(error);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: {
        assets: true,
        transactions: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found');
    }

    // --- Build CSV for Transactions ---
    const txHeaders = ['Date', 'Asset Name', 'Type', 'Amount ($)', 'Price ($)', 'Quantity', 'Status'];
    const txRows = portfolio.transactions.map((t) => [
      t.date ? new Date(t.date).toISOString().split('T')[0] : '',
      `"${t.assetName}"`,
      t.type,
      Number(t.amount).toFixed(2),
      t.price ? Number(t.price).toFixed(2) : '',
      t.quantity ? Number(t.quantity).toFixed(6) : '',
      t.status
    ]);

    // --- Build CSV for Assets ---
    const assetHeaders = ['Asset Name', 'Type', 'Quantity', 'Avg Cost ($)', 'Current Price ($)', 'Total Invested ($)'];
    const assetRows = portfolio.assets.map((a) => [
      `"${a.name}"`,
      a.type,
      Number(a.quantity).toFixed(6),
      Number(a.averageCost).toFixed(2),
      Number(a.currentPrice).toFixed(2),
      Number(a.totalInvested).toFixed(2)
    ]);

    // Combine into a single CSV with section labels
    const lines = [
      `QuantVault Portfolio Export — ${new Date().toISOString()}`,
      `Portfolio Name: "${portfolio.name}"`,
      `Cash Balance: $${Number(portfolio.cashBalance).toFixed(2)}`,
      '',
      '=== TRANSACTIONS ===',
      txHeaders.join(','),
      ...txRows.map((r) => r.join(',')),
      '',
      '=== HOLDINGS ===',
      assetHeaders.join(','),
      ...assetRows.map((r) => r.join(','))
    ];

    const csvContent = lines.join('\r\n');
    const filename = `quantvault_portfolio_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csvContent); // BOM for Excel compatibility
  } catch (error) {
    next(error);
  }
};

const getPortfolioHistory = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId }
    });

    if (!portfolio) {
      return res.json({ success: true, data: [] });
    }

    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        portfolioId: portfolio.id,
        date: { gte: since }
      },
      orderBy: { date: 'asc' }
    });

    res.json({
      success: true,
      data: snapshots.map((s) => ({
        date: s.date,
        totalValue: Number(s.totalValue),
        cashBalance: Number(s.cashBalance),
        totalGainLoss: Number(s.totalGainLoss)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/portfolio/analytics/indicators ───────────────────────────────────
// Returns SMA-20, SMA-50, and RSI-14 computed from daily portfolio snapshots
const getTechnicalIndicators = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { userId: req.userId } });
    if (!portfolio) return res.json({ success: true, data: null });

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { date: 'asc' }
    });

    if (snapshots.length < 2) {
      return res.json({ success: true, data: { sma20: null, sma50: null, rsi14: null, prices: [] } });
    }

    const prices = snapshots.map((s) => Number(s.totalValue));

    const sma = (arr, period) => {
      if (arr.length < period) return null;
      const slice = arr.slice(-period);
      return Math.round((slice.reduce((s, v) => s + v, 0) / period) * 100) / 100;
    };

    const rsi = (arr, period = 14) => {
      if (arr.length < period + 1) return null;
      const slice = arr.slice(-(period + 1));
      let gains = 0, losses = 0;
      for (let i = 1; i < slice.length; i++) {
        const diff = slice[i] - slice[i - 1];
        if (diff > 0) gains += diff; else losses -= diff;
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return Math.round((100 - 100 / (1 + rs)) * 100) / 100;
    };

    res.json({
      success: true,
      data: {
        sma20: sma(prices, 20),
        sma50: sma(prices, 50),
        rsi14: rsi(prices, 14),
        dataPoints: prices.length,
        latestValue: prices[prices.length - 1],
        prices: prices.slice(-50),  // last 50 for chart
        labels: snapshots.slice(-50).map((s) => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
    });
  } catch (err) { next(err); }
};

// ── POST /api/portfolio/transactions/import-csv ───────────────────────────────
// Bulk insert transactions from CSV data (parsed client-side)
const importTransactionsCSV = async (req, res, next) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ success: false, message: 'No transactions provided' });
    }

    const portfolio = await prisma.portfolio.findUnique({ where: { userId: req.userId } });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const { classifyAsset } = require('../services/assetClassifier');
    const valid = [];
    const errors = [];

    transactions.forEach((tx, idx) => {
      const { assetName, type, amount, price, quantity, date } = tx;
      if (!assetName || !type || !amount || !date) {
        errors.push(`Row ${idx + 1}: Missing required fields (assetName, type, amount, date)`);
        return;
      }
      if (!['buy', 'sell', 'dividend', 'interest'].includes(type.toLowerCase())) {
        errors.push(`Row ${idx + 1}: Invalid type "${type}"`);
        return;
      }
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        errors.push(`Row ${idx + 1}: Invalid date "${date}"`);
        return;
      }
      valid.push({
        portfolioId: portfolio.id,
        assetName: assetName.trim(),
        type: type.toLowerCase(),
        amount: Math.abs(Number(amount)),
        price: price ? Math.abs(Number(price)) : null,
        quantity: quantity ? Math.abs(Number(quantity)) : null,
        date: parsedDate,
        status: 'completed'
      });
    });

    if (valid.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid transactions to import', errors });
    }

    const result = await prisma.transaction.createMany({ data: valid, skipDuplicates: false });

    res.json({
      success: true,
      message: `Imported ${result.count} transaction(s)${errors.length > 0 ? ` (${errors.length} skipped)` : ''}`,
      data: { imported: result.count, skipped: errors.length, errors: errors.slice(0, 10) }
    });
  } catch (err) { next(err); }
};

module.exports = {
  getPortfolio,
  getTransactions,
  createTransaction,
  deleteTransaction,
  exportPortfolio,
  exportCSV,
  clearAllTransactions,
  getPortfolioHistory,
  getTechnicalIndicators,
  importTransactionsCSV
};

