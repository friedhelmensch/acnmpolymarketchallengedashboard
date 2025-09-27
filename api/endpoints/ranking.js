require("dotenv").config();
const PolymarketUserStatsService = require("../src/polyMarketUserStatsService");

async function handler(req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const users = JSON.parse(process.env["USERS"]);
    const userStatsService = new PolymarketUserStatsService();

    if (!users || !Array.isArray(users)) {
      throw new Error("Invalid config file: users array not found");
    }

    // Get quick summaries for all users
    const summaries = await Promise.allSettled(
      users.map(async (user) => {
        const stats = await userStatsService.getUserStats(user);
        return {
          stats,
          user,
        };
      })
    );

    // Process results and separate successful from failed
    const results = summaries.map((result, index) => {
      if (result.status === "fulfilled") {
        var user = result.value.user;
        var stats = result.value.stats;

        const retVal = {
          polyMarketName: user.polymarketName,
          discordName: user.discordName,
          status: stats.status,
          initialDeposit: user.startingBalance,
          currentPNL: stats.pnl,
          pnlPercentage: stats.pnlPercentage,
        };
        return retVal;
      } else {
        return {
          address: users[index],
          status: "error",
          message: `Failed to analyze: ${
            result.reason?.message || "Unknown error"
          }`,
        };
      }
    });

    // Return the list of quick summaries
    res.status(200).json({
      timestamp: new Date().toISOString(),
      totalusers: users.length,
      data: results,
    });
  } catch (error) {
    console.error("Error in ranking endpoint:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = handler;
