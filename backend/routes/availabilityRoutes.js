const express = require("express");
const router = express.Router();

const {
  createAvailability,
  getAvailability,
} = require("../controllers/availabilityController");

// (optional debug — ONLY AFTER import)
console.log("createAvailability:", createAvailability);
console.log("getAvailability:", getAvailability);

router.post("/availability", createAvailability);
router.get("/availability/:eventId", getAvailability);

module.exports = router;