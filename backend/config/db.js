const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("calendly_clone", "root", "root123", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ Error:", err));

module.exports = sequelize;