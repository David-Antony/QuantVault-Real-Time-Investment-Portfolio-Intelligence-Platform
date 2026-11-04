/* global apiClient */
/**
 * Client-side API wrapper for Analytics, Market Data, and Portfolio Reports.
 */
// eslint-disable-next-line no-unused-vars
class AnalyticsApi {
  /**
   * Fetches quantitative portfolio insights (Sharpe ratio, volatility, diversification score).
   * @returns {Promise<Object>} API response object
   */
  static async getInsights() {
    const response = await apiClient.get('/reports/insights');
    return response.data;
  }

  /**
   * Fetches Monte Carlo forecasts and simulation paths.
   * @param {number} days - Simulation projection window (default 30)
   * @returns {Promise<Object>} API response object
   */
  static async getForecast(days = 30) {
    const response = await apiClient.get(`/reports/forecast?days=${days}`);
    return response.data;
  }

  /**
   * Fetches real-time market overview quotes for benchmark indices and cryptos.
   * @returns {Promise<Object>} API response object
   */
  static async getMarketQuotes() {
    const response = await apiClient.get('/market');
    return response.data;
  }

  /**
   * Triggers browser download for executive PDF portfolio summary report.
   */
  static async downloadPDFReport() {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/reports/pdf', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `QuantVault_Executive_Report_${date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

if (typeof window !== 'undefined') {
  window.AnalyticsApi = AnalyticsApi;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsApi;
}
