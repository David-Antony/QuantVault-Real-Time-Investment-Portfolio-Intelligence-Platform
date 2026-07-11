/**
 * Math Utils for Advanced Financial Analytics
 */

/**
 * Calculates the Extended Internal Rate of Return (XIRR).
 * XIRR is used to determine the rate of return of an investment with cash flows at irregular intervals.
 * @param {Array<{amount: number, date: Date}>} cashFlows
 * @param {number} guess - initial guess for the rate (default 0.1)
 * @returns {number} The calculated XIRR as a decimal.
 */
function calculateXIRR(cashFlows, guess = 0.1) {
  if (cashFlows.length === 0) return 0;
  
  // Sort cash flows by date
  const sortedFlows = [...cashFlows].sort((a, b) => a.date - b.date);
  const startDate = sortedFlows[0].date;

  // Helper function to calculate NPV (Net Present Value)
  const calculateNPV = (rate) => {
    return sortedFlows.reduce((acc, cf) => {
      const days = (cf.date - startDate) / (1000 * 60 * 60 * 24);
      return acc + cf.amount / Math.pow(1 + rate, days / 365.0);
    }, 0);
  };

  // Helper function for the derivative of NPV
  const calculateNPVDerivative = (rate) => {
    return sortedFlows.reduce((acc, cf) => {
      const days = (cf.date - startDate) / (1000 * 60 * 60 * 24);
      return acc - (days / 365.0) * cf.amount / Math.pow(1 + rate, (days / 365.0) + 1);
    }, 0);
  };

  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(rate);
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    const derivative = calculateNPVDerivative(rate);
    if (Math.abs(derivative) < tolerance) {
      // Derivative too small, cannot proceed with Newton-Raphson
      return 0;
    }
    rate = rate - npv / derivative;
  }

  // If it doesn't converge, return a basic fallback (0)
  return 0;
}

/**
 * Calculates the Beta of a portfolio relative to a benchmark (e.g. S&P 500)
 * Beta = Covariance(Portfolio Returns, Benchmark Returns) / Variance(Benchmark Returns)
 * @param {number[]} portfolioReturns - Array of historical % returns for the portfolio
 * @param {number[]} benchmarkReturns - Array of historical % returns for the benchmark
 * @returns {number} The Beta value
 */
function calculateBeta(portfolioReturns, benchmarkReturns) {
  if (portfolioReturns.length !== benchmarkReturns.length || portfolioReturns.length < 2) {
    return 1.0; // Default beta is 1 (market equivalent)
  }

  const n = portfolioReturns.length;
  
  const meanPortfolio = portfolioReturns.reduce((a, b) => a + b, 0) / n;
  const meanBenchmark = benchmarkReturns.reduce((a, b) => a + b, 0) / n;

  let covariance = 0;
  let variance = 0;

  for (let i = 0; i < n; i++) {
    const pDiff = portfolioReturns[i] - meanPortfolio;
    const bDiff = benchmarkReturns[i] - meanBenchmark;
    
    covariance += (pDiff * bDiff);
    variance += (bDiff * bDiff);
  }

  if (variance === 0) return 1.0;

  return covariance / variance;
}

module.exports = {
  calculateXIRR,
  calculateBeta
};
