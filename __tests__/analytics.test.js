/**
 * Unit tests for QuantVault Analytics calculations
 * Run with: npm test
 */

// ── Helper functions extracted from analyticsController.js for testing ──────
function stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function diversificationScore(assets, totalValue) {
  if (assets.length === 0 || totalValue <= 0) return 0;
  const weights = assets.map((a) => a.currentValue / totalValue).filter((w) => w > 0);
  if (weights.length === 0) return 0;
  const entropy = -weights.reduce((s, w) => s + w * Math.log(w), 0);
  const maxEntropy = Math.log(assets.length);
  return maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;
}

function sma(prices, period) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return Math.round((slice.reduce((s, v) => s + v, 0) / period) * 100) / 100;
}

function rsi(prices, period = 14) {
  if (prices.length < period + 1) return null;
  const slice = prices.slice(-(period + 1));
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
}

// ── Asset Classifier ──────────────────────────────────────────────────────────
const { classifyAsset } = require('../server/services/assetClassifier');

// ═══════════════════════════════════════════════════════
// ANALYTICS TESTS
// ═══════════════════════════════════════════════════════

describe('Standard Deviation (Volatility)', () => {
  test('returns 0 for empty array', () => {
    expect(stdDev([])).toBe(0);
  });

  test('returns 0 for single-element array', () => {
    expect(stdDev([5])).toBe(0);
  });

  test('returns correct stddev for known values', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9] → σ = 2
    const result = stdDev([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result).toBeCloseTo(2.138, 1);
  });

  test('returns 0 for all-identical values', () => {
    expect(stdDev([5, 5, 5, 5])).toBe(0);
  });
});

describe('Diversification Score', () => {
  test('returns 0 for empty portfolio', () => {
    expect(diversificationScore([], 0)).toBe(0);
  });

  test('returns 0 for single asset (no diversification)', () => {
    const assets = [{ currentValue: 10000 }];
    const score = diversificationScore(assets, 10000);
    expect(score).toBe(0);
  });

  test('returns 100 for perfectly equally-weighted portfolio', () => {
    const assets = [
      { currentValue: 2500 },
      { currentValue: 2500 },
      { currentValue: 2500 },
      { currentValue: 2500 }
    ];
    const score = diversificationScore(assets, 10000);
    expect(score).toBeCloseTo(100, 1);
  });

  test('score is higher for more equal distribution', () => {
    const concentrated = [{ currentValue: 9000 }, { currentValue: 500 }, { currentValue: 500 }];
    const balanced = [{ currentValue: 3333 }, { currentValue: 3333 }, { currentValue: 3334 }];
    const concentratedScore = diversificationScore(concentrated, 10000);
    const balancedScore = diversificationScore(balanced, 10000);
    expect(balancedScore).toBeGreaterThan(concentratedScore);
  });
});

// ═══════════════════════════════════════════════════════
// TECHNICAL INDICATORS
// ═══════════════════════════════════════════════════════

describe('Simple Moving Average (SMA)', () => {
  const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 110, 112];

  test('returns null if not enough data', () => {
    expect(sma([100, 102], 20)).toBeNull();
  });

  test('computes SMA-5 correctly', () => {
    // Last 5: [108, 107, 109, 110, 112] → avg = 109.2
    expect(sma(prices, 5)).toBe(109.2);
  });

  test('computes SMA-3 for small array', () => {
    expect(sma([10, 20, 30], 3)).toBe(20);
  });
});

describe('Relative Strength Index (RSI)', () => {
  test('returns null if insufficient data', () => {
    expect(rsi([100, 101, 102], 14)).toBeNull();
  });

  test('returns 100 when all moves are gains (no losses)', () => {
    const risingPrices = Array.from({ length: 20 }, (_, i) => 100 + i);
    expect(rsi(risingPrices, 14)).toBe(100);
  });

  test('returns a value between 0 and 100', () => {
    const prices = [44, 46, 45, 47, 48, 46, 44, 43, 45, 47, 48, 49, 50, 48, 47];
    const result = rsi(prices, 14);
    if (result !== null) {
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });
});

// ═══════════════════════════════════════════════════════
// ASSET CLASSIFIER
// ═══════════════════════════════════════════════════════

describe('Asset Type Classifier', () => {
  test('classifies BTC as Crypto', () => {
    expect(classifyAsset('BTC')).toBe('Crypto');
  });

  test('classifies ETH as Crypto', () => {
    expect(classifyAsset('ETH')).toBe('Crypto');
  });

  test('classifies BTCUSD as Crypto', () => {
    expect(classifyAsset('BTCUSD')).toBe('Crypto');
  });

  test('classifies SPY as ETF', () => {
    expect(classifyAsset('SPY')).toBe('ETF');
  });

  test('classifies QQQ as ETF', () => {
    expect(classifyAsset('QQQ')).toBe('ETF');
  });

  test('classifies AAPL as Stock', () => {
    expect(classifyAsset('AAPL')).toBe('Stock');
  });

  test('classifies MSFT as Stock', () => {
    expect(classifyAsset('MSFT')).toBe('Stock');
  });

  test('classifies EURUSD as Forex', () => {
    expect(classifyAsset('EURUSD')).toBe('Forex');
  });

  test('is case-insensitive', () => {
    expect(classifyAsset('btc')).toBe('Crypto');
    expect(classifyAsset('spy')).toBe('ETF');
  });

  test('classifies name containing "Bitcoin" as Crypto', () => {
    expect(classifyAsset('MYTOKEN', 'Bitcoin Cash')).toBe('Crypto');
  });
});
