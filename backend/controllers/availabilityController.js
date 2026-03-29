const Availability = require("../models/availabilityModel");

// CREATE AVAILABILITY
const createAvailability = async (req, res) => {
  try {
    const { event_type_id, day_of_week, start_time, end_time, timezone } = req.body;

    const availability = await Availability.create({
      event_type_id,
      day_of_week,
      start_time,
      end_time,
      timezone,
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET AVAILABILITY
const getAvailability = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Availability.findAll({
      where: { event_type_id: eventId },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
};