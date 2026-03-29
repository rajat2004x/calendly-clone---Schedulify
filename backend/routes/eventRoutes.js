const express = require("express");
const router = express.Router();


const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  getEventByUsernameAndSlug,
} = require("../controllers/eventController");


router.post("/events", createEvent);
router.get("/events", getEvents);
// Public event fetch by username and slug (must be before :id)
router.get("/events/:username/:eventSlug", getEventByUsernameAndSlug);
router.get("/events/:id", getEventById);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

module.exports = router;