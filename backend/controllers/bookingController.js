const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const { Op } = require("sequelize");
const { sendBookingConfirmation, sendBookingCancellation } = require("../utils/emailService");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { event_type_id, event_id, date, start_time, end_time, name, email, guest_notes } = req.body;
    const eventId = event_id || event_type_id;

    const bufferMinutes = 15;

    // Convert times to Date objects for comparison
    const start = new Date(`1970-01-01T${start_time}`);
    const end = new Date(`1970-01-01T${end_time}`);

    // Add buffer before and after
    const bufferedStart = new Date(start.getTime() - bufferMinutes * 60000);
    const bufferedEnd = new Date(end.getTime() + bufferMinutes * 60000);

    const existing = await Booking.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { event_type_id: eventId },
              { event_id: eventId }
            ]
          },
          { date },
          {
            [Op.or]: [
              {
                start_time: {
                  [Op.between]: [
                    bufferedStart.toTimeString().slice(0, 8),
                    bufferedEnd.toTimeString().slice(0, 8),
                  ],
                },
              },
              {
                end_time: {
                  [Op.between]: [
                    bufferedStart.toTimeString().slice(0, 8),
                    bufferedEnd.toTimeString().slice(0, 8),
                  ],
                },
              },
            ]
          }
        ],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Slot unavailable (buffer applied)" });
    }

    const booking = await Booking.create({
      event_type_id: eventId,
      event_id: eventId,
      date,
      start_time,
      end_time,
      name,
      email,
      guest_notes,
    });

    // Fetch event name to include in confirmation email
    try {
      const event = await Event.findByPk(eventId);
      if (event) {
        await sendBookingConfirmation(booking, event.name);
      }
    } catch (emailError) {
      console.warn("Email notification failed, but booking was created:", emailError.message);
    }

    res.json(booking);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL BOOKINGS
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['date', 'DESC'], ['start_time', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.destroy();

    // Send cancellation email
    try {
      const event = await Event.findByPk(booking.event_id || booking.event_type_id);
      if (event) {
        await sendBookingCancellation(booking, event.name);
      }
    } catch (emailError) {
      console.warn("Cancellation email failed, but booking was deleted:", emailError.message);
    }

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Send cancellation email
    try {
      const event = await Event.findByPk(booking.event_id || booking.event_type_id);
      if (event) {
        await sendBookingCancellation(booking, event.name);
      }
    } catch (emailError) {
      console.warn("Cancellation email failed, but booking was cancelled:", emailError.message);
    }

    res.json({ message: "Booking cancelled" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RESCHEDULE BOOKING
const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time } = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const conflict = await Booking.findOne({
      where: {
        [Op.or]: [
          { event_type_id: booking.event_type_id },
          { event_id: booking.event_id }
        ],
        date,
        start_time,
      },
    });

    if (conflict) {
      return res.status(400).json({ error: "New slot already booked" });
    }

    booking.date = date;
    booking.start_time = start_time;
    booking.end_time = end_time;

    await booking.save();

    res.json(booking);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking,
  cancelBooking,
  rescheduleBooking,
};