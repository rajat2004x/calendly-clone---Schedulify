const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { notFoundHandler, globalErrorHandler } = require("./middleware/errorHandler");

// Ensure models are registered for associations.
require("./models/eventModel");
require("./models/availabilityModel");
require("./models/bookingModel");

const bookingRoutes = require("./routes/bookingRoutes");
const eventRoutes = require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const slotRoutes = require("./routes/slotRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "*";

app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", eventRoutes);
app.use("/api", availabilityRoutes);
app.use("/api", slotRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
