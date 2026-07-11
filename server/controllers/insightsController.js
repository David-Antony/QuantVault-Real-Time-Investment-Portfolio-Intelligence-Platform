/**
 * AI Portfolio Insights Controller — QuantVault
 * Generates automated risk-allocation insights using Google Gemini API.
 * Falls back to local rule-based analysis if no GEMINI_API_KEY environment variable is set.
 */

const { prisma } = require('../config/db');

const getPortfolioInsights = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: { assets: true }
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const assets = portfolio.assets;
    const cash = Number(portfolio.cashBalance);
    const totalAssetValue = assets.reduce((sum, a) => sum + Number(a.currentPrice) * Number(a.quantity), 0);
    const totalPortfolioValue = totalAssetValue + cash;

    const apiKey = process.env.GEMINI_API_KEY;
    let insights = '';

    if (apiKey) {
      // ── Google Gemini AI Integration ───────────────────────────
      const assetSummary = assets.map(a => `- ${a.name} (${a.type}): Value $${(Number(a.currentPrice) * Number(a.quantity)).toFixed(2)} (${((Number(a.currentPrice) * Number(a.quantity) / totalPortfolioValue) * 100).toFixed(1)}%)`).join('\n');
      
      const prompt = `You are a professional wealth advisor. Analyze the following portfolio:
Total Value: $${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Cash Balance: $${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${((cash / totalPortfolioValue) * 100).toFixed(1)}%)
Holdings:
${assetSummary || 'No active holdings.'}

Provide exactly 3 concise, actionable insights (max 100 words per insight) in markdown format. 
Focus on:
1. Asset Allocation & Diversification (Warn if cash is too high or one asset dominates).
2. Risk Management (Suggest rebalancing if needed).
3. Strategic Opportunities (Briefly suggest next steps).

Keep the tone professional, direct, and actionable. Refer to assets by name. Do not include introductory text or meta commentary. Start directly with the insights.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const result = await response.json();
          insights = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          console.warn('[InsightsController] Gemini request failed, status:', response.status);
        }
      } catch (err) {
        console.warn('[InsightsController] Gemini fetch error:', err.message);
      }
    }

    // ── Local Rule-Based Fallback ────────────────────────────────
    if (!insights) {
      const tips = [];

      // Cash Balance Check
      const cashPct = (cash / totalPortfolioValue) * 100;
      if (cashPct > 50) {
        tips.push(`### 💵 High Cash Allocation (${cashPct.toFixed(1)}%)
Your cash balance represents a significant portion of your portfolio. While holding cash provides safety and optionality, you may be experiencing opportunity costs. Consider dollar-cost averaging (DCA) into diversified index funds or ETFs to capture market growth.`);
      } else if (cashPct < 5) {
        tips.push(`### ⚠️ Low Liquidity Alert (${cashPct.toFixed(1)}%)
Your portfolio is highly invested with minimal liquid cash. Maintaining a cash buffer of at least 5-10% is recommended for emergencies, market downturns, or buying opportunities without forcing the liquidation of core holdings.`);
      } else {
        tips.push(`### 💵 Balanced Cash Cushion (${cashPct.toFixed(1)}%)
Your cash allocation is well-balanced. This provides sufficient liquidity for opportunistic purchases while ensuring the majority of your assets are working for you in the market.`);
      }

      // Concentration Check
      let concentratedAsset = null;
      for (const a of assets) {
        const val = Number(a.currentPrice) * Number(a.quantity);
        const pct = (val / totalPortfolioValue) * 100;
        if (pct > 35) {
          concentratedAsset = { name: a.name, pct };
          break;
        }
      }

      if (concentratedAsset) {
        tips.push(`### ⚠️ Asset Concentration Risk
Your position in **${concentratedAsset.name}** constitutes **${concentratedAsset.pct.toFixed(1)}%** of your total portfolio. A single position exceeding 35% exposes you to excessive unsystematic risk. Rebalancing into other asset types or sectors is highly recommended to improve overall diversification.`);
      } else if (assets.length > 0) {
        tips.push(`### ⚖️ Healthy Asset Diversification
No single position dominates your portfolio. This healthy distribution helps buffer against sector-specific downturns and ensures your risk is spread across different holdings.`);
      }

      // Asset Class Diversity
      const types = [...new Set(assets.map(a => a.type.toLowerCase()))];
      if (types.length === 1 && assets.length > 1) {
        tips.push(`### 🔄 Limited Sector Variety
All your holdings are classified under the same asset class (**${types[0]}**). Diversifying across multiple classes (Stocks, Crypto, ETFs, Forex) can lower correlation between your assets, improving risk-adjusted returns.`);
      } else if (assets.length === 0) {
        tips.push(`### 💼 Empty Portfolio
You haven't recorded any transactions yet. Use the **Transactions** page to add buy/sell records, which will generate live performance metrics and custom AI investment insights.`);
      } else {
        tips.push(`### 🛡️ Asset Class Variance
Your holdings cover multiple asset classes (**${types.join(', ')}**). This multi-asset coverage reduces systemic risk and helps optimize performance in different market conditions.`);
      }

      insights = tips.join('\n\n');
    }

    res.json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};

const getMonteCarloForecast = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: { assets: true }
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const cash = Number(portfolio.cashBalance);
    const totalAssetValue = portfolio.assets.reduce((sum, a) => sum + Number(a.currentPrice) * Number(a.quantity), 0);
    const initialValue = totalAssetValue + cash;

    // Simulate 1000 paths over 10 years (120 months)
    const months = 120;
    const paths = 1000;
    const expectedMonthlyReturn = 0.006; // ~7.2% annual
    const monthlyVolatility = 0.04; // ~14% annual

    const finalValues = [];

    for (let i = 0; i < paths; i++) {
      let value = initialValue;
      for (let m = 0; m < months; m++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        
        const returnRate = expectedMonthlyReturn + z * monthlyVolatility;
        value = value * (1 + returnRate);
      }
      finalValues.push(value);
    }

    finalValues.sort((a, b) => a - b);
    const percentile10 = finalValues[Math.floor(paths * 0.1)];
    const percentile50 = finalValues[Math.floor(paths * 0.5)];
    const percentile90 = finalValues[Math.floor(paths * 0.9)];

    res.json({
      success: true,
      data: {
        initialValue: Math.round(initialValue),
        forecast10Years: {
          percentile10: Math.round(percentile10),
          percentile50: Math.round(percentile50),
          percentile90: Math.round(percentile90)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolioInsights, getMonteCarloForecast };
