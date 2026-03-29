const sequelize = require("./config/db");
const Event = require("./models/eventModel");
const Availability = require("./models/availabilityModel");
const Booking = require("./models/bookingModel");

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Authenticate and sync
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");

    // Clear existing data
    await Event.destroy({ where: {} });
    await Availability.destroy({ where: {} });
    await Booking.destroy({ where: {} });
    console.log("🗑️  Cleared existing data");

    // Create sample events
    const events = await Event.bulkCreate([
      {
        name: "30 Minute Consultation",
        duration: 30,
        description: "Quick 30-minute meeting to discuss your needs",
        slug: "30-min-consultation",
        buffer_time: 15,
        custom_questions: [
          "What is the purpose of this meeting?",
          "Do you have any specific questions prepared?"
        ]
      },
      {
        name: "1 Hour Strategy Session",
        duration: 60,
        description: "In-depth 1-hour strategy and planning session",
        slug: "1-hour-strategy",
        buffer_time: 10,
        custom_questions: [
          "What are your main goals?",
          "What challenges are you facing?"
        ]
      },
      {
        name: "15 Minute Quick Call",
        duration: 15,
        description: "Quick check-in or brief question",
        slug: "15-min-call",
        buffer_time: 5,
        custom_questions: []
      }
    ]);

    console.log("✅ Created 3 sample events");

    // Create availability for each event (Monday-Friday, 9 AM - 5 PM)
    const workingDays = [1, 2, 3, 4, 5]; // Monday to Friday

    for (const event of events) {
      for (const day of workingDays) {
        await Availability.create({
          event_type_id: event.id,
          day_of_week: day,
          start_time: "09:00:00",
          end_time: "17:00:00",
          is_available: true
        });
      }
    }

    console.log("✅ Created availability for all events (Mon-Fri, 9-5)");

    // Create sample bookings
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    await Booking.bulkCreate([
      {
        event_id: events[0].id,
        date: today.toISOString().split('T')[0],
        start_time: "10:00:00",
        end_time: "10:30:00",
        name: "John Doe",
        email: "john@example.com",
        status: "scheduled",
        guest_notes: JSON.stringify({
          "What is the purpose of this meeting?": "Discuss project requirements",
          "Do you have any specific questions prepared?": "Yes, about timelines"
        })
      },
      {
        event_id: events[1].id,
        date: nextWeek.toISOString().split('T')[0],
        start_time: "14:00:00",
        end_time: "15:00:00",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "scheduled",
        guest_notes: JSON.stringify({
          "What are your main goals?": "Increase market share",
          "What challenges are you facing?": "Team scalability"
        })
      },
      {
        event_id: events[2].id,
        date: nextMonth.toISOString().split('T')[0],
        start_time: "11:00:00",
        end_time: "11:15:00",
        name: "Bob Wilson",
        email: "bob@example.com",
        status: "scheduled",
        guest_notes: ""
      },
      {
        event_id: events[0].id,
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: "09:00:00",
        end_time: "09:30:00",
        name: "Alice Johnson",
        email: "alice@example.com",
        status: "scheduled",
        guest_notes: ""
      }
    ]);

    console.log("✅ Created 4 sample bookings");

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📊 Sample Data Created:");
    console.log("  - 3 Event Types");
    console.log("  - Availability set for Mon-Fri, 9 AM - 5 PM");
    console.log("  - 4 Sample Bookings (past and future)");
    console.log("\n🚀 Sample event links:");
    console.log("  - /book/30-min-consultation");
    console.log("  - /book/1-hour-strategy");
    console.log("  - /book/15-min-call");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
