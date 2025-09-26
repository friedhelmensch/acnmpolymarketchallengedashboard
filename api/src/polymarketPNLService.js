const axios = require('axios');

class PolymarketPNLService {
    constructor() {
        // Polymarket PNL API endpoint
        this.pnlBaseURL = 'https://user-pnl-api.polymarket.com';
        this.balanceAPIURL = 'https://polymarket.com/api';
    }

    /**
     * Get total lifetime PNL for an account with percentage calculation
     * @param {string} address - The wallet address
     * @param {number} initialBalance - Optional: The initial balance to calculate percentage against
     * @returns {Promise<Object>} Total PNL summary with percentage
     */
    async getTotalPNL(address, initialBalance = null) {
        try {
            const response = await axios.get(`${this.pnlBaseURL}/user-pnl`, {
                params: {
                    user_address: address,
                    interval: 'all',
                    fidelity: '3h'
                }
            });

            const pnlData = response.data;
            
            if (!pnlData || pnlData.length === 0) {
                return {
                    address,
                    totalPNL: 0,
                    totalPNLPercentage: 0,
                    message: 'No PNL data found for this address'
                };
            }

            // Get the latest (most recent) PNL value - this is the total lifetime PNL
            const latestPNL = pnlData[pnlData.length - 1];
            const totalPNLValue = parseFloat(latestPNL.p.toFixed(4));
            
            // Calculate percentage if we have initial balance
            let pnlPercentage = null;
            let estimatedInitialBalance = null;
            
            if (initialBalance !== null && initialBalance > 0) {
                pnlPercentage = parseFloat(((totalPNLValue / initialBalance) * 100).toFixed(2));
            } else {
                // Try to get current balance from profile API to estimate initial balance
                try {
                    const currentBalance = await this.getCurrentBalance(address);
                    if (currentBalance !== null) {
                        estimatedInitialBalance = currentBalance - totalPNLValue;
                        if (estimatedInitialBalance > 0) {
                            pnlPercentage = parseFloat(((totalPNLValue / estimatedInitialBalance) * 100).toFixed(2));
                        }
                    }
                } catch (balanceError) {
                    //console.log('Could not fetch current balance for percentage calculation');
                }
            }

            const result = {
                address,
                totalPNL: totalPNLValue,
                totalPNLPercentage: pnlPercentage,
                firstPNLDate: new Date(pnlData[0].t * 1000).toISOString(),
                latestPNLDate: new Date(latestPNL.t * 1000).toISOString(),
                dataPoints: pnlData.length
            };

            if (initialBalance !== null) {
                result.initialBalance = initialBalance;
                result.estimatedCurrentBalance = initialBalance + totalPNLValue;
            } else if (estimatedInitialBalance !== null) {
                result.estimatedInitialBalance = parseFloat(estimatedInitialBalance.toFixed(4));
            }

            return result;

        } catch (error) {
            console.error('Error fetching PNL data:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            throw error;
        }
    }

    /**
     * Attempt to get current balance from Polymarket profile API
     * @param {string} address - The wallet address
     * @returns {Promise<number|null>} Current balance or null if not available
     */
    async getCurrentBalance(address) {
        try {
            // Try the profile API to get current balance
            const response = await axios.get(`${this.balanceAPIURL}/profile/${address}`);
            
            if (response.data && response.data.portfolio_value) {
                return parseFloat(response.data.portfolio_value);
            }
            
            return null;
        } catch (error) {
            //console.log('Could not fetch balance from profile API:', error.message);
            return null;
        }
    }

    /**
     * Calculate PNL percentage with a known initial balance
     * @param {string} address - The wallet address  
     * @param {number} initialBalance - The initial balance when trading started
     * @returns {Promise<Object>} PNL data with percentage
     */
    async getPNLWithKnownBalance(address, initialBalance) {
        return this.getTotalPNL(address, initialBalance);
    }

    /**
     * Get PNL progression over time
     * @param {string} address - The wallet address
     * @param {number} initialBalance - Optional initial balance for percentage calculations
     * @returns {Promise<Object>} PNL progression data
     */
    async getPNLProgression(address, initialBalance = null) {
        try {
            //console.log(`Fetching PNL progression for address: ${address}`);
            
            const response = await axios.get(`${this.pnlBaseURL}/user-pnl`, {
                params: {
                    user_address: address,
                    interval: 'all',
                    fidelity: '3h'
                }
            });

            const pnlData = response.data;
            
            if (!pnlData || pnlData.length === 0) {
                return {
                    address,
                    message: 'No PNL data found for this address',
                    progression: []
                };
            }

            const progression = pnlData.map((entry, index) => {
                const pnlValue = parseFloat(entry.p.toFixed(4));
                const result = {
                    timestamp: entry.t,
                    date: new Date(entry.t * 1000).toISOString(),
                    pnl: pnlValue
                };

                if (initialBalance && initialBalance > 0) {
                    result.pnlPercentage = parseFloat(((pnlValue / initialBalance) * 100).toFixed(2));
                    result.estimatedBalance = parseFloat((initialBalance + pnlValue).toFixed(4));
                }

                return result;
            });

            return {
                address,
                initialBalance: initialBalance,
                dataPoints: progression.length,
                firstDate: progression[0].date,
                lastDate: progression[progression.length - 1].date,
                progression: progression
            };

        } catch (error) {
            console.error('Error fetching PNL progression:', error.message);
            throw error;
        }
    }
}

module.exports = PolymarketPNLService;
module.exports = PolymarketPNLService;