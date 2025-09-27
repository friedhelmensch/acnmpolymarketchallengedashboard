const create = require("../src/bootstrapper");

async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const allUsersService = create();
    const results = await allUsersService.getResultsForAllUsers();
    res.status(200).json({
      timestamp: new Date().toISOString(),
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
