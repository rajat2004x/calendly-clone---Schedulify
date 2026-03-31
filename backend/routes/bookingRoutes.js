const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  createBooking,
  getBookings,
  deleteBooking,
  cancelBooking,
  rescheduleBooking,
} = require("../controllers/bookingController");

router.post("/bookings", asyncHandler(createBooking));
router.get("/bookings", asyncHandler(getBookings));
router.delete("/bookings/:id", asyncHandler(deleteBooking));
router.put("/bookings/:id/cancel", asyncHandler(cancelBooking));
router.put("/bookings/:id/reschedule", asyncHandler(rescheduleBooking));

// Legacy routes for backward compatibility
router.post("/book", asyncHandler(createBooking));
router.put("/cancel/:id", asyncHandler(cancelBooking));
router.put("/reschedule/:id", asyncHandler(rescheduleBooking));

module.exports = router;