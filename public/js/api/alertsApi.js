/* global apiClient */
/**
 * Client-side API wrapper for Price and Asset Alert endpoints.
 */
// eslint-disable-next-line no-unused-vars
class AlertsApi {
  /**
   * Fetches all price alerts for the authenticated user.
   * @returns {Promise<Object>} API response object
   */
  static async getAlerts() {
    const response = await apiClient.get('/alerts');
    return response.data;
  }

  /**
   * Creates a new price or percentage alert.
   * @param {Object} alertData - { assetName, condition, targetPrice }
   * @returns {Promise<Object>} API response object
   */
  static async createAlert(alertData) {
    const response = await apiClient.post('/alerts', alertData);
    return response.data;
  }

  /**
   * Toggles the active status of an alert.
   * @param {string|number} id - Alert identifier
   * @returns {Promise<Object>} API response object
   */
  static async toggleAlert(id) {
    const response = await apiClient.patch(`/alerts/${id}/toggle`);
    return response.data;
  }

  /**
   * Deletes an alert by its ID.
   * @param {string|number} id - Alert identifier
   * @returns {Promise<Object>} API response object
   */
  static async deleteAlert(id) {
    const response = await apiClient.delete(`/alerts/${id}`);
    return response.data;
  }
}

if (typeof window !== 'undefined') {
  window.AlertsApi = AlertsApi;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlertsApi;
}
