class AllUsersService {
  constructor(users, polymarketUserStatsService) {
    this.users = users;
    this.statsService = polymarketUserStatsService;
  }

  async getResultsForAllUsers() {
    const getResult = this.GetResult.bind(this);

    return await Promise.all(this.users.map(getResult));
  }

  async GetResult(user) {
    try {
      const stats = await this.statsService.getUserStats(user);
      const result = {
        polyMarketName: user.polymarketName,
        discordName: user.discordName,
        status: stats.status,
        initialDeposit: user.startingBalance,
        currentPNL: stats.pnl,
        pnlPercentage: stats.pnlPercentage,
      };
      return result;
    } catch (error) {
      return {
        status: "error",
        message: `Failed to analyze: ${user.discordName} - ${error.message}`,
      };
    }
  }
}

module.exports = AllUsersService;
