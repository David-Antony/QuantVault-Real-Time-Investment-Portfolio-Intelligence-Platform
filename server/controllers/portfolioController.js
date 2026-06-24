const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

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

module.exports = {
  getPortfolio,
  getTransactions,
  createTransaction,
  deleteTransaction,
  exportPortfolio,
  clearAllTransactions
};
