require("dotenv").config();
const AllUsersService = require("./allUsersService");
const PolymarketPNLService = require("./polymarketPNLService");
const PolymarketUserStatsService = require("./polyMarketUserStatsService");

function create() {
  const userStatsService = new PolymarketUserStatsService(
    new PolymarketPNLService()
  );

  const users = JSON.parse(process.env["USERS"]);
  if (!users || !Array.isArray(users)) {
    throw new Error("Invalid config file: users array not found");
  }

  return new AllUsersService(users, userStatsService);
}

module.exports = create;
