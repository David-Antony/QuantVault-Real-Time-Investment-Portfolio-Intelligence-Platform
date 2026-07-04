/**
 * Mock Price Engine — simulates realistic stock price movement
 * Uses Brownian motion (Geometric Random Walk) so prices look real.
 * Replace fetchPrice() with a real API call (Alpha Vantage, etc.) when ready.
 */

// Seed prices per asset name (case-insensitive key)
const _priceStore = new Map();

const BASE_PRICES = {
  aapl: 182.5, msft: 415.2, googl: 175.8, amzn: 195.3, tsla: 248.6,
  meta: 510.4, nvda: 875.2, nflx: 640.1, default: 100.0
};

function _getBasePrice(name) {
  const key = name.toLowerCase().replace(/\s+/g, '');
  return BASE_PRICES[key] || BASE_PRICES.default;
}

/**
 * Fetch or simulate a price for a given asset name.
 * Each call applies a small random walk ±0.5%.
 */
function fetchPrice(assetName) {
  const key = assetName.toLowerCase();
  if (!_priceStore.has(key)) {
    _priceStore.set(key, _getBasePrice(assetName));
  }
  const current = _priceStore.get(key);
  // Brownian drift: ±0.5% per tick
  const change = current * (Math.random() * 0.01 - 0.005);
  const next = Math.max(0.01, current + change);
  _priceStore.set(key, next);
  return Math.round(next * 100) / 100;
}

/**
 * Get all tracked asset names from the DB and broadcast price updates
 * to each user's private Socket.io room every TICK_MS milliseconds.
 */
const { prisma } = require('../config/db');

const TICK_MS = 8000; // Price tick every 8 seconds

async function startPriceBroadcast(io) {
  console.log('[PriceService] Starting real-time price broadcast (every 8s)...');

  setInterval(async () => {
    try {
      // Get all unique (portfolioId, assetName, userId) combos in one query
      const portfolios = await prisma.portfolio.findMany({
        include: { assets: true }
      });

      for (const portfolio of portfolios) {
        if (portfolio.assets.length === 0) continue;

        const priceMap = {};
        let newTotalAssetValue = 0;

        for (const asset of portfolio.assets) {
          const newPrice = fetchPrice(asset.name);
          priceMap[asset.name] = newPrice;
          newTotalAssetValue += newPrice * Number(asset.quantity);

          // Persist updated price to DB
          await prisma.asset.update({
            where: { id: asset.id },
            data: { currentPrice: newPrice }
          });
        }

        const totalValue = newTotalAssetValue + Number(portfolio.cashBalance);

        // Emit to user's private room: `user_${userId}`
        io.to(`user_${portfolio.userId}`).emit('price:update', {
          portfolioId: portfolio.id,
          prices: priceMap,
          totalValue: Math.round(totalValue * 100) / 100,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('[PriceService] Broadcast error:', err.message);
    }
  }, TICK_MS);
}

module.exports = { fetchPrice, startPriceBroadcast };
