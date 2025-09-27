const PolymarketPNLService = require("./polymarketPNLService");

class WalletAnalysisService {
  constructor() {
    this.polymarketPNLService = new PolymarketPNLService();
  }

  /**
   * Get a quick summary of wallet performance
   * @param {string} address - The wallet address to analyze
   * @returns {Promise<Object>} Quick performance summary
   */
  async getQuickSummary(address, initialBalance) {
    try {
      const pnl = await this.polymarketPNLService.getTotalPNL(address);
      const pnlPercentage = this.getPercentage(pnl, initialBalance);

      return {
        address,
        status: pnl > 0 ? "profitable" : pnl < 0 ? "loss" : "break-even",
        initialDeposit: initialBalance,
        currentPNL: pnl,
        pnlPercentage: pnlPercentage,
      };
    } catch (error) {
      return {
        address,
        status: "error",
        message: `Analysis failed: ${error.message}`,
      };
    }
  }

  getPercentage(pnl, initialBalance) {
    if (initialBalance === 0) return 0;
    const totalPNLValue = parseFloat(pnl.toFixed(4));

    // Calculate percentage if we have initial balance
    const pnlPercentage = parseFloat(
      ((totalPNLValue / initialBalance) * 100).toFixed(2)
    );

    return pnlPercentage;
  }
}

module.exports = WalletAnalysisService;
