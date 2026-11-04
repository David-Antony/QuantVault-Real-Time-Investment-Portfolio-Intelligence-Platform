/* global apiClient */
/**
 * Client-side API wrapper for Asset Watchlist endpoints.
 */
// eslint-disable-next-line no-unused-vars
class WatchlistApi {
  /**
   * Fetches all watchlist items for the authenticated user.
   * @returns {Promise<Object>} API response object
   */
  static async getWatchlist() {
    const response = await apiClient.get('/watchlist');
    return response.data;
  }

  /**
   * Adds an asset to the user's watchlist.
   * @param {Object} itemData - { symbol, assetType }
   * @returns {Promise<Object>} API response object
   */
  static async addToWatchlist(itemData) {
    const response = await apiClient.post('/watchlist', itemData);
    return response.data;
  }

  /**
   * Removes an item from the user's watchlist.
   * @param {string|number} id - Watchlist item identifier
   * @returns {Promise<Object>} API response object
   */
  static async removeFromWatchlist(id) {
    const response = await apiClient.delete(`/watchlist/${id}`);
    return response.data;
  }
}

if (typeof window !== 'undefined') {
  window.WatchlistApi = WatchlistApi;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WatchlistApi;
}
