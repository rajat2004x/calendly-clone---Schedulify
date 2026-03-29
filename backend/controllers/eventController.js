const { sendBookingConfirmation } = require("../utils/emailService");
const Event = require("../models/eventModel");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const { name, duration, description } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const event = await Event.create({
      name,
      duration,
      description: description || null,
      slug,
    });

    // ✅ SEND EMAIL AFTER EVENT CREATION
    try {
      await sendBookingConfirmation(
        {
          name: "Rajat", // change later if needed
          email: "rajat2004x@gmail.com", // 👈 YOUR EMAIL
          date: new Date(),
          start_time: "N/A",
          end_time: "N/A",
        },
        event.name
      );
      console.log("📧 Event creation email sent");
    } catch (emailError) {
      console.log("❌ Email failed:", emailError.message);
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const { slug } = req.query;

    if (slug) {
      // Get event by slug
      const event = await Event.findOne({ where: { slug } });
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      return res.json(event);
    }

    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET EVENT BY ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️  DELETE EVENT REQUEST - ID: ${id}`);
    
    const event = await Event.findByPk(id);
    if (!event) {
      console.log(`❌ Event not found with ID: ${id}`);
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete related bookings first
    const Booking = require("../models/bookingModel");
    const Availability = require("../models/availabilityModel");
    
    console.log(`📋 Deleting bookings for event ${id}...`);
    // Delete bookings (use both event_id and event_type_id for safety)
    await Booking.destroy({ where: { event_id: id } });
    await Booking.destroy({ where: { event_type_id: id } });
    
    console.log(`⏰ Deleting availability for event ${id}...`);
    // Delete availability (uses event_type_id)
    await Availability.destroy({ where: { event_type_id: id } });
    
    console.log(`🔥 Deleting event ${id}...`);
    // Then delete the event
    await event.destroy();
    console.log(`✅ Event ${id} deleted successfully!`);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting event:`, error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, description, buffer_time, custom_questions } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Update event fields
    if (name) event.name = name;
    if (duration) event.duration = duration;
    if (description !== undefined) event.description = description;
    if (buffer_time !== undefined) event.buffer_time = buffer_time;
    if (custom_questions !== undefined) event.custom_questions = custom_questions;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};