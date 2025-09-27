require("dotenv").config();
const AllUsersService = require("../src/allUsersService");
const PolymarketPNLService = require("../src/PolymarketPNLService");
const PolymarketUserStatsService = require("../src/polyMarketUserStatsService");

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
