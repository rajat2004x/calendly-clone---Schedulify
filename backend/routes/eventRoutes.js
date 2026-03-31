const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");


const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  getEventByUsernameAndSlug,
} = require("../controllers/eventController");


router.post("/events", asyncHandler(createEvent));
router.get("/events", asyncHandler(getEvents));
// Public event fetch by username and slug (must be before :id)
router.get("/events/:username/:eventSlug", asyncHandler(getEventByUsernameAndSlug));
router.get("/events/:id", asyncHandler(getEventById));
router.put("/events/:id", asyncHandler(updateEvent));
router.delete("/events/:id", asyncHandler(deleteEvent));

module.exports = router;