const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  event_type_id: {
    type: DataTypes.INTEGER,
  },
  event_id: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  start_time: {
    type: DataTypes.TIME,
  },
  end_time: {
    type: DataTypes.TIME,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "scheduled",
  },
  guest_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Guest answers to custom questions",
  },
});

module.exports = Booking;