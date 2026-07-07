/**
 * Asset Type Classifier
 *
 * Automatically detects whether an asset is a Stock, Crypto, ETF, Forex, or Other
 * based on ticker symbol patterns — no external API required.
 */

const CRYPTO_SYMBOLS = new Set([
  'BTC','ETH','BNB','XRP','SOL','ADA','DOGE','DOT','AVAX','LINK','MATIC',
  'LTC','ATOM','UNI','ALGO','XLM','VET','ICP','FIL','SAND','MANA','AXS',
  'NEAR','AAVE','COMP','MKR','SNX','CAKE','FTM','ONE','HBAR','EGLD','THETA',
  'RUNE','ENJ','CHZ','BAT','ZIL','HOT','LUNA','CRO','SHIB','PEPE','ARB',
  'OP','SUI','APT','INJ','TON','TRX','XMR','ZEC','DASH','ETC','BCH','BSV'
]);

const ETF_SYMBOLS = new Set([
  'SPY','QQQ','IWM','VTI','VOO','DIA','GLD','SLV','TLT','HYG','LQD','EEM',
  'EFA','VEA','VWO','BND','AGG','XLF','XLK','XLE','XLV','XLY','XLI','XLP',
  'XLU','XLB','ARKK','ARKG','ARKF','ARKQ','ARKW','SCHB','SCHD','VIG','VYM',
  'NOBL','SPHD','HDV','DGRO','VLUE','USMV','EFAV','EEMV','ACWI','VT','VXUS',
  'IXUS','BNDW','BNDX','MINT','SGOV','IGSB','VCSH','VCLT','BSV','BIV','BLV',
  'VTIP','TIPS','STIP','SCHI','SCHZ','FZROX','FZILX','FBTC','FETH'
]);

const FOREX_PATTERN = /^[A-Z]{3}[A-Z]{3}$|^[A-Z]{3}\/[A-Z]{3}$/;

/**
 * Classify an asset by its symbol or name.
 * Returns: 'Crypto' | 'ETF' | 'Forex' | 'Stock' | 'Other'
 */
function classifyAsset(symbol, name = '') {
  const sym = symbol.toUpperCase().trim().replace(/\s+/g, '');
  const nm  = name.toUpperCase();

  // Crypto check
  if (CRYPTO_SYMBOLS.has(sym)) return 'Crypto';
  if (nm.includes('BITCOIN') || nm.includes('ETHEREUM') || nm.includes('CRYPTO') || nm.includes('COIN')) return 'Crypto';
  // Crypto trailing USD e.g. BTCUSD, ETHUSD
  if (sym.endsWith('USD') && CRYPTO_SYMBOLS.has(sym.replace('USD', ''))) return 'Crypto';

  // ETF check
  if (ETF_SYMBOLS.has(sym)) return 'ETF';
  if (nm.includes('ETF') || nm.includes('FUND') || nm.includes('TRUST') || nm.includes('INDEX')) return 'ETF';

  // Forex
  if (FOREX_PATTERN.test(sym)) return 'Forex';

  // Default: Stock
  return 'Stock';
}

/**
 * Returns a color class for the asset type badge.
 */
function getAssetTypeColor(type) {
  const map = {
    Crypto: { bg: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: 'rgba(245,158,11,0.3)' },
    ETF:    { bg: 'rgba(129,140,248,0.15)', color: '#818CF8', border: 'rgba(129,140,248,0.3)' },
    Forex:  { bg: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: 'rgba(56,189,248,0.3)' },
    Stock:  { bg: 'rgba(16,185,129,0.12)', color: '#34D399', border: 'rgba(16,185,129,0.3)' },
    Other:  { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: 'rgba(148,163,184,0.2)' }
  };
  return map[type] || map.Other;
}

module.exports = { classifyAsset, getAssetTypeColor };
