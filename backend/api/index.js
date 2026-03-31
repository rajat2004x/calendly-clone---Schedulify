const serverless = require("serverless-http");
const app = require("../app");
const initializeDatabase = require("../config/initDb");

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await initializeDatabase();
    return handler(req, res);
  } catch (error) {
    console.error("❌ Serverless init error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to initialize server" }));
  }
};
