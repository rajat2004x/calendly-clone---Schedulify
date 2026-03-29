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

// GET AVAILABILITY (with slot generation and filtering)
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const getAvailability = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { date } = req.query;

    // Get all availability settings for the event
    const availabilities = await Availability.findAll({
      where: { event_type_id: eventId },
    });

    // If no date provided, return raw availabilities
    if (!date) {
      return res.json(availabilities);
    }

    // Get event duration (in minutes)
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    const duration = event.duration;
    const buffer = event.buffer_time || 0;

    // Find all bookings for this event on the date
    const bookings = await Booking.findAll({
      where: { event_id: eventId, date },
    });

    // Helper: convert HH:mm:ss to minutes
    function timeToMinutes(t) {
      const [h, m, s] = t.split(":").map(Number);
      return h * 60 + m;
    }
    // Helper: convert minutes to HH:mm
    function minutesToTime(mins) {
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      return `${h}:${m}`;
    }

    // Get day of week (0=Sunday, 6=Saturday)
    const dayOfWeek = new Date(date).getDay();
    // Find availabilities for this day
    const todaysAvail = availabilities.filter(a => a.day_of_week === dayOfWeek);

    let slots = [];
    for (const avail of todaysAvail) {
      const startMins = timeToMinutes(avail.start_time);
      const endMins = timeToMinutes(avail.end_time);
      for (let t = startMins; t + duration <= endMins; t += duration + buffer) {
        const slotStart = minutesToTime(t);
        const slotEnd = minutesToTime(t + duration);
        // Check if slot is already booked
        const isBooked = bookings.some(b => {
          const bStart = timeToMinutes(b.start_time);
          const bEnd = timeToMinutes(b.end_time);
          return (
            (t >= bStart && t < bEnd) || (t + duration > bStart && t + duration <= bEnd)
          );
        });
        slots.push({
          start: slotStart,
          end: slotEnd,
          available: !isBooked,
        });
      }
    }
    // Only return available slots
    const availableSlots = slots.filter(s => s.available);
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
};