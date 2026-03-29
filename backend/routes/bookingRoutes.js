const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  deleteBooking,
  cancelBooking,
  rescheduleBooking,
} = require("../controllers/bookingController");

router.post("/bookings", createBooking);
router.get("/bookings", getBookings);
router.delete("/bookings/:id", deleteBooking);
router.put("/bookings/:id/cancel", cancelBooking);
router.put("/bookings/:id/reschedule", rescheduleBooking);

// Legacy routes for backward compatibility
router.post("/book", createBooking);
router.put("/cancel/:id", cancelBooking);
router.put("/reschedule/:id", rescheduleBooking);

module.exports = router;