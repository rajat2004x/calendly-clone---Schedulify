const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const { getAvailableSlots } = require("../controllers/slotController");

router.get("/slots", asyncHandler(getAvailableSlots));

module.exports = router;