const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Availability = sequelize.define("Availability", {
  event_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.INTEGER,
  },
  start_time: {
    type: DataTypes.TIME,
  },
  end_time: {
    type: DataTypes.TIME,
  },
  timezone: {
    type: DataTypes.STRING,
  },
});

module.exports = Availability;