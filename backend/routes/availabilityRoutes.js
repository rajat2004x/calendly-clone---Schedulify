const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  createAvailability,
  getAvailability,
} = require("../controllers/availabilityController");

router.post("/availability", asyncHandler(createAvailability));
// Supports ?date=YYYY-MM-DD
router.get("/availability/:eventId", asyncHandler(getAvailability));

module.exports = router;