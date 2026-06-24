class Transaction {
  constructor(id, date, assetName, type, amount, price = null, quantity = null, status = 'completed') {
    this.id = id;
    this.date = date;
    this.assetName = assetName;
    this.type = type;
    this.amount = parseFloat(amount);
    this.price = price ? parseFloat(price) : null;
    this.quantity = quantity ? parseFloat(quantity) : null;
    this.status = status;
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      assetName: this.assetName,
      type: this.type,
      amount: this.amount,
      price: this.price,
      quantity: this.quantity,
      status: this.status
    };
  }

  static fromJSON(data) {
    return new Transaction(
      data.id, data.date, data.assetName, data.type,
      data.amount, data.price, data.quantity, data.status
    );
  }
}

class Asset {
  constructor(name, type = 'stock', currentPrice = 0, quantity = 0) {
    this.name = name;
    this.type = type;
    this.currentPrice = parseFloat(currentPrice);
    this.quantity = parseFloat(quantity);
    this.averageCost = 0;
    this.totalInvested = 0;
  }

  get currentValue() {
    return this.currentPrice * this.quantity;
  }

  get totalGainLoss() {
    return this.currentValue - this.totalInvested;
  }

  get gainLossPercentage() {
    if (this.totalInvested === 0) return 0;
    return (this.totalGainLoss / this.totalInvested) * 100;
  }

  static fromJSON(data) {
    const asset = new Asset(data.name, data.type, data.currentPrice, data.quantity);
    asset.averageCost = data.averageCost || 0;
    asset.totalInvested = data.totalInvested || 0;
    return asset;
  }
}

class Portfolio {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || 'My Portfolio';
    this.assets = [];
    this.transactions = [];
    this.cashBalance = data.cashBalance || 100000;
    this.totalValue = data.totalValue || this.cashBalance;
    this.totalInvested = data.totalInvested || 0;
    this.totalGainLoss = data.totalGainLoss || 0;
    this.totalGainLossPercentage = data.totalGainLossPercentage || 0;
    this.assetAllocation = data.assetAllocation || {};

    if (data.assets) {
      this.assets = data.assets.map((a) => Asset.fromJSON(a));
    }
    if (data.transactions) {
      this.transactions = data.transactions.map((t) => Transaction.fromJSON(t));
    }
  }

  get performanceMetrics() {
    return {
      totalValue: this.totalValue,
      totalInvested: this.totalInvested,
      gainLoss: this.totalGainLoss,
      gainLossPercentage: this.totalGainLossPercentage,
      cashBalance: this.cashBalance,
      numberOfAssets: this.assets.length,
      numberOfTransactions: this.transactions.length
    };
  }
}

let portfolioData = null;

const PortfolioDataStore = {
  async loadPortfolio() {
    try {
      if (!AuthApi.isLoggedIn()) {
        return new Portfolio();
      }
      const response = await PortfolioApi.getPortfolio();
      portfolioData = new Portfolio(response.data);
      return portfolioData;
    } catch (error) {
      return new Portfolio();
    }
  },

  async savePortfolio() {
    return true;
  },

  async addTransaction(data) {
    try {
      const response = await PortfolioApi.createTransaction(data);
      await this.loadPortfolio();
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add transaction';
      return { success: false, message };
    }
  },

  async deleteTransaction(id) {
    try {
      await PortfolioApi.deleteTransaction(id);
      await this.loadPortfolio();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete transaction';
      return { success: false, message };
    }
  },

  async clearAllTransactions() {
    try {
      await PortfolioApi.clearAllTransactions();
      await this.loadPortfolio();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear transactions';
      return { success: false, message };
    }
  },

  async exportData() {
    try {
      const response = await PortfolioApi.exportPortfolio();
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getPortfolio() {
    return portfolioData;
  }
};

window.Transaction = Transaction;
window.Asset = Asset;
window.Portfolio = Portfolio;
window.PortfolioDataStore = PortfolioDataStore;
