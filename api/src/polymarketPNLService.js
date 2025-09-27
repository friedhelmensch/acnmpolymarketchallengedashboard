const axios = require("axios");

class PolymarketPNLService {
  constructor() {
    this.pnlBaseURL = "https://user-pnl-api.polymarket.com";
  }

  async getTotalPNL(address) {
    try {
      const response = await axios.get(`${this.pnlBaseURL}/user-pnl`, {
        params: {
          user_address: address,
          interval: "all",
          fidelity: "3h",
        },
      });

      const pnlData = response.data;
      if (!pnlData || pnlData.length === 0) {
        return 0;
      }

      // Get the latest (most recent) PNL value - this is the total lifetime PNL
      const latestPNL = pnlData[pnlData.length - 1].p;
      return latestPNL;
    } catch (error) {
      console.error("Error fetching PNL data:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }
}

module.exports = PolymarketPNLService;
