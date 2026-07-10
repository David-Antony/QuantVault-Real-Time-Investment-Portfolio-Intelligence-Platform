class PortfolioApi {
  static async getPortfolio() {
    const response = await apiClient.get('/portfolio');
    return response.data;
  }

  static async getPortfolioHistory(days = 30) {
    const response = await apiClient.get(`/portfolio/history?days=${days}`);
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

  static async exportCSV() {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/portfolio/export/csv', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('CSV export failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `quantvault_portfolio_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async clearAllTransactions() {
    const response = await apiClient.delete('/portfolio/clear');
    return response.data;
  }
}
