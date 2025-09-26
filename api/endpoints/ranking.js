require('dotenv').config();

// Import the WalletAnalysisService using require since it uses CommonJS
const WalletAnalysisService = require('../src/walletAnalysisService');

async function handler(req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const users = JSON.parse(process.env['USERS']);
    const walletAnalysisService = new WalletAnalysisService();
    
    if (!users || !Array.isArray(users)) {
      throw new Error('Invalid config file: users array not found');
    }
    
    // Get quick summaries for all users
    const summaries = await Promise.allSettled(
      users.map(async (user) => {
        return await walletAnalysisService.getQuickSummary(user.walletAddress, user.startingBalance);
      })
    );
    
    // Process results and separate successful from failed
    const results = summaries.map((result, index) => {
      if (result.status === 'fulfilled') {
        var discordName = users.find(u => u.walletAddress === result.value.address)?.discordName || 'Unknown';
        const retVal = {
                discordName : discordName,
                status: result.value.status,
                initialDeposit: result.value.initialDeposit,
                currentPNL: result.value.currentPNL,
                pnlPercentage: result.value.pnlPercentage
        }
        return retVal;
      } else {
        return {
          address: users[index],
          status: 'error',
          message: `Failed to analyze: ${result.reason?.message || 'Unknown error'}`
        };
      }
    });
    
    // Return the list of quick summaries
    res.status(200).json({
      timestamp: new Date().toISOString(),
      totalusers: users.length,
      data: results
    });
    
  } catch (error) {
    console.error('Error in ranking endpoint:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = handler;