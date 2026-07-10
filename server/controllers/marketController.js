const ApiError = require('../utils/ApiError');

/**
 * GET /api/market/search?q={query}
 * Searches Yahoo Finance for stock symbols matching the query.
 */
const searchSymbols = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === '') {
      return res.json({ success: true, data: [] });
    }

    const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`);
    if (!response.ok) {
      throw new Error('Failed to fetch from Yahoo Finance Search API');
    }

    const data = await response.json();
    
    // Extract quotes from the result
    const quotes = data.quotes || [];
    const results = quotes
      .filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'CRYPTOCURRENCY' || q.quoteType === 'INDEX')
      .map(q => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        type: q.quoteType,
        exchange: q.exchange
      }));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('[MarketSearch] Error:', error.message);
    // Return empty array instead of failing completely, for better UX
    res.json({ success: true, data: [] });
  }
};

module.exports = {
  searchSymbols
};
