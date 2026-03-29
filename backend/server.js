const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

// MODELS
const Event = require("./models/eventModel");
const Availability = require("./models/availabilityModel");
const Booking = require("./models/bookingModel");
const bookingRoutes = require("./routes/bookingRoutes");

// ROUTES
const eventRoutes = require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const slotRoutes = require("./routes/slotRoutes");

// ✅ CREATE APP FIRST
const app = express();

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.use(cors());
app.use(express.json());

app.use("/api", bookingRoutes);

// ✅ USE ROUTES AFTER APP IS CREATED
app.use("/api", eventRoutes);
app.use("/api", availabilityRoutes);
app.use("/api", slotRoutes);

// Test endpoint to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// 404 handler for debugging
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.listen(5000, async () => {
  console.log("Server running on port 5000");

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");

  } catch (error) {
    console.error("❌ Error:", error);
  }
});