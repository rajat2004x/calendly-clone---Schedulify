require("dotenv").config();

let initPromise = null;

async function initializeDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      const sequelize = require("./db");
      await sequelize.authenticate();
      console.log("✅ Database connected successfully");

      const shouldAlter = process.env.DB_SYNC_ALTER === "true";
      await sequelize.sync(shouldAlter ? { alter: true } : undefined);
      console.log("✅ Tables synced");
    })();
  }

  return initPromise;
}

module.exports = initializeDatabase;
