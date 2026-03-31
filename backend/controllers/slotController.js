const Availability = require("../models/availabilityModel");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const generateSlots = require("../utils/slotGenerator");

exports.getAvailableSlots = async (req, res) => {
  try {
    const { eventId, date } = req.query;

    // 1. Get event (for duration)
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 2. Get day of week (0 = Sunday, 1 = Monday...)
    const day = new Date(date).getDay();

    // 3. Get availability
    const availability = await Availability.findOne({
      where: {
        event_type_id: eventId,
        day_of_week: day,
      },
    });

    if (!availability) {
      return res.json([]);
    }

    // 4. Generate slots (pass buffer time)
    let slots = generateSlots(
      availability.start_time,
      availability.end_time,
      event.duration,
      event.buffer_time || 0
    );

    // 5. Get booked slots
    const bookings = await Booking.findAll({
      where: {
        event_type_id: eventId,
        date,
      },
    });

    const bookedTimes = bookings.map((b) => b.start_time);

    // 6. Remove booked slots
    slots = slots.filter((slot) => !bookedTimes.includes(slot.start));

    res.json(slots);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};