const PolymarketPNLService = require('./polymarketPNLService');

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

            const pnlData = await this.polymarketPNLService.getTotalPNL(address, initialBalance);
                        
            return {
                address,
                status: pnlData.totalPNL > 0 ? 'profitable' : pnlData.totalPNL < 0 ? 'loss' : 'break-even',
                initialDeposit: initialBalance,
                currentPNL: pnlData.totalPNL,
                pnlPercentage: pnlData.totalPNLPercentage
            };

        } catch (error) {
            return {
                address,
                status: 'error',
                message: `Analysis failed: ${error.message}`
            };
        }
    }
}

module.exports = WalletAnalysisService;