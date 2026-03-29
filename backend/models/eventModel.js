const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define("Event", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  buffer_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Buffer time in minutes before/after meeting",
  },
  custom_questions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Array of custom invitee questions",
  },
});

module.exports = Event;