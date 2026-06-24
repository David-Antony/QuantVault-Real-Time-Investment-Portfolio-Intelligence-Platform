class PortfolioApi {
  static async getPortfolio() {
    const response = await apiClient.get('/portfolio');
    return response.data;
  }

  static async getTransactions() {
    const response = await apiClient.get('/portfolio/transactions');
    return response.data;
  }

  static async createTransaction(data) {
    const response = await apiClient.post('/portfolio/transactions', data);
    return response.data;
  }

  static async deleteTransaction(id) {
    const response = await apiClient.delete(`/portfolio/transactions/${id}`);
    return response.data;
  }

  static async exportPortfolio() {
    const response = await apiClient.get('/portfolio/export');
    return response.data;
  }

  static async clearAllTransactions() {
    const response = await apiClient.delete('/portfolio/clear');
    return response.data;
  }
}
