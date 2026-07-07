const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

// ── GET /api/watchlist ─────────────────────────────────────────
const getWatchlist = async (req, res, next) => {
  try {
    const items = await prisma.watchlistItem.findMany({
      where: { userId: req.userId },
      orderBy: { addedAt: 'desc' }
    });
    const { fetchPrice } = require('../services/priceService');
    const enriched = items.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      notes: item.notes,
      targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      currentPrice: fetchPrice(item.symbol),
      addedAt: item.addedAt
    }));
    res.json({ success: true, data: enriched });
  } catch (err) { next(err); }
};

// ── POST /api/watchlist ────────────────────────────────────────
const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol, name, notes, targetPrice } = req.body;
    if (!symbol || !name) throw ApiError.badRequest('symbol and name are required');

    const item = await prisma.watchlistItem.upsert({
      where: { userId_symbol: { userId: req.userId, symbol: symbol.toUpperCase().trim() } },
      create: {
        userId: req.userId,
        symbol: symbol.toUpperCase().trim(),
        name: name.trim(),
        notes: notes || null,
        targetPrice: targetPrice ? Number(targetPrice) : null
      },
      update: {
        name: name.trim(),
        notes: notes || null,
        targetPrice: targetPrice ? Number(targetPrice) : null
      }
    });
    res.status(201).json({ success: true, message: `${symbol.toUpperCase()} added to watchlist`, data: item });
  } catch (err) { next(err); }
};

// ── DELETE /api/watchlist/:id ──────────────────────────────────
const removeFromWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.watchlistItem.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });
    if (!item) throw ApiError.notFound('Watchlist item not found');
    await prisma.watchlistItem.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (err) { next(err); }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
