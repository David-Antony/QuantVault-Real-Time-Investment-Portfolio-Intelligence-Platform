/**
 * Real Market Price Engine & Alerts Trigger — QuantVault
 * Fetches real stock/crypto prices from Yahoo Finance with 30s caching.
 * Evaluates active user price alerts and emits Socket.io notifications.
 */

const { prisma } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// Price cache mapping: { TICKER: { price, timestamp } }
const PRICE_CACHE = new Map();
const CACHE_TTL_MS = 30000; // 30 seconds cache TTL

const BASE_PRICES = {
  aapl: 182.5, msft: 415.2, googl: 175.8, amzn: 195.3, tsla: 248.6,
  meta: 510.4, nvda: 875.2, nflx: 640.1, default: 100.0
};

function _getBasePrice(name) {
  const key = name.toLowerCase().replace(/\s+/g, '');
  return BASE_PRICES[key] || BASE_PRICES.default;
}

/**
 * Fetch price from Yahoo Finance or fallback to simulation
 */
async function fetchPrice(assetName) {
  const key = assetName.trim().toUpperCase();
  const cached = PRICE_CACHE.get(key);
  const now = Date.now();

  // Return cached price if still fresh
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.price;
  }

  let price = null;

  try {
    let querySymbol = key;
    // Map standard cryptos to Yahoo format (e.g. BTC -> BTC-USD)
    if (['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP', 'LINK'].includes(key)) {
      querySymbol = `${key}-USD`;
    }

    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}`);
    if (response.ok) {
      const data = await response.json();
      const regularPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (regularPrice && typeof regularPrice === 'number') {
        price = Math.round(regularPrice * 100) / 100;
        console.log(`[PriceService] Fetched real price for ${key}: $${price}`);
      }
    }
  } catch (err) {
    console.warn(`[PriceService] Failed to fetch real price for ${key}:`, err.message);
  }

  // Fallback to Geometric Random Walk simulation if API fetch failed
  if (price === null) {
    const lastPrice = cached ? cached.price : _getBasePrice(assetName);
    const change = lastPrice * (Math.random() * 0.01 - 0.005);
    price = Math.round(Math.max(0.01, lastPrice + change) * 100) / 100;
  }

  PRICE_CACHE.set(key, { price, timestamp: now });
  return price;
}

/**
 * Broadcast price updates to connected users and check active alerts
 */
const TICK_MS = 8000;

async function startPriceBroadcast(io) {
  console.log('[PriceService] Starting real-time price broadcast (every 8s)...');

  setInterval(async () => {
    try {
      const portfolios = await prisma.portfolio.findMany({
        include: { assets: true }
      });

      for (const portfolio of portfolios) {
        if (portfolio.assets.length === 0) continue;

        const priceMap = {};
        let newTotalAssetValue = 0;

        for (const asset of portfolio.assets) {
          const newPrice = await fetchPrice(asset.name);
          priceMap[asset.name] = newPrice;
          newTotalAssetValue += newPrice * Number(asset.quantity);

          // Persist updated price to DB
          await prisma.asset.update({
            where: { id: asset.id },
            data: { currentPrice: newPrice }
          });

          // Check active price alerts for this user & asset
          const alerts = await prisma.priceAlert.findMany({
            where: {
              userId: portfolio.userId,
              isActive: true,
              assetName: { equals: asset.name, mode: 'insensitive' }
            }
          });

          for (const alert of alerts) {
            const target = Number(alert.targetPrice);
            let triggered = false;

            if (alert.condition === 'above' && newPrice >= target) triggered = true;
            if (alert.condition === 'below' && newPrice <= target) triggered = true;

            if (triggered) {
              const triggeredAlert = await prisma.priceAlert.update({
                where: { id: alert.id },
                data: { isActive: false, triggeredAt: new Date() }
              });

              // Log audit event
              await logAudit(portfolio.userId, 'ALERT_TRIGGERED', {
                alertId: alert.id,
                assetName: asset.name,
                price: newPrice,
                condition: alert.condition,
                targetPrice: target
              });

              // Emit alert to user via WS
              io.to(`user_${portfolio.userId}`).emit('alert:triggered', {
                id: triggeredAlert.id,
                assetName: triggeredAlert.assetName,
                condition: triggeredAlert.condition,
                targetPrice: Number(triggeredAlert.targetPrice),
                currentPrice: newPrice,
                triggeredAt: triggeredAlert.triggeredAt
              });
              console.log(`[PriceService] Alert triggered for User ${portfolio.userId}: ${asset.name} is ${alert.condition} ${target} (current: ${newPrice})`);
            }
          }
        }

        const totalValue = newTotalAssetValue + Number(portfolio.cashBalance);

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

