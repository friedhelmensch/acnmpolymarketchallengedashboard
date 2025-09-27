const PolymarketPNLService = require("./polymarketPNLService");

class PolymarketUserStatsService {
  constructor() {
    this.polymarketPNLService = new PolymarketPNLService();
  }

  async getUserStats(user) {
    try {
      const pnl = await this.polymarketPNLService.getTotalPNL(
        user.walletAddress
      );
      const pnlPercentage = this.getPercentage(pnl, user.startingBalance);

      return {
        status: pnl > 0 ? "profitable" : pnl < 0 ? "loss" : "break-even",
        pnl: pnl,
        pnlPercentage: pnlPercentage,
      };
    } catch (error) {
      return {
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

module.exports = PolymarketUserStatsService;
