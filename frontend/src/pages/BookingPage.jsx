import { useState, useEffect, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Clock, User, Mail, Calendar, Globe } from "lucide-react";
import {
  getUserTimezone,
  getAvailabilitySettings,
  isAvailableOnDay,
  filterSlotsByAvailability,
} from "../utils/timezoneUtils";

const SlotsGrid = memo(function SlotsGrid({ slots, onSelectSlot, selectedSlot }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.id || `${slot.start}-${slot.end}`}
          onClick={() => onSelectSlot(slot)}
          className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
            selectedSlot?.start === slot.start
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {slot.start}
        </button>
      ))}
    </div>
  );
});

function BookingPage() {
  const { eventSlug } = useParams();
  const [event, setEvent] = useState(null);
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitorTimezone, setVisitorTimezone] = useState(getUserTimezone());
  const [availability, setAvailability] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    guest_notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Detect visitor's timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setVisitorTimezone(tz);
    } catch {
      console.log("Could not detect timezone, using default");
    }
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events?slug=${eventSlug}`
        );
        setEvent(res.data);
        
        // Load availability settings for this event
        const eventAvailability = getAvailabilitySettings(res.data.id);
        setAvailability(eventAvailability);
      } catch (error) {
        console.error("Event not found:", error);
      }
    };
    fetchEvent();
  }, [eventSlug]);

  // Fetch slots when date changes
  const fetchSlots = async (date) => {
    if (!event) return;
    
    // Check if date is available based on working hours
    if (availability && !isAvailableOnDay(date, availability)) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    
    try {
      const res = await axios.get(
        `http://localhost:5000/api/slots?eventId=${event.id}&date=${date}`
      );
      
      // Filter slots based on availability settings
      const filteredSlots = filterSlotsByAvailability(
        res.data || [],
        date,
        availability
      );
      setSlots(filteredSlots);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    }
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    fetchSlots(dateStr);
  };

  const handleSelectSlot = useCallback((slot) => {
    setSelectedSlot(slot);
  }, []);

  const handleBooking = async () => {
    if (!bookingData.name.trim() || !bookingData.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/bookings", {
        event_id: event.id,
        date: selectedDate,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        name: bookingData.name,
        email: bookingData.email,
        guest_notes: bookingData.guest_notes || "",
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedSlot(null);
        setBookingData({ name: "", email: "", guest_notes: "" });
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to confirm booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading event...</p>
        </div>
      </main>
    );
  }

  // Get available dates (next 30 days)
  const availableDates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    availableDates.push(date);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Panel - Event Info */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 border border-slate-200 h-fit">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {event.name}
          </h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{event.duration} minutes</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm">{visitorTimezone}</span>
            </div>
            {event.description && (
              <p className="text-slate-600 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="pt-8 border-t border-slate-200">
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 ${
                  selectedDate ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  {selectedDate && <div className="w-2 h-2 bg-current rounded-full" />}
                </div>
                <span className="text-sm font-medium">Select a date</span>
              </div>
              <div
                className={`flex items-center gap-3 ${
                  selectedSlot ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  {selectedSlot && <div className="w-2 h-2 bg-current rounded-full" />}
                </div>
                <span className="text-sm font-medium">Select a time</span>
              </div>
              <div
                className={`flex items-center gap-3 ${
                  bookingData.name && bookingData.email
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  {bookingData.name && bookingData.email && (
                    <div className="w-2 h-2 bg-current rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium">Your details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Booking Form */}
        <div className="md:col-span-3">
          {!selectedSlot ? (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Select a date and time
              </h2>

              {/* Calendar Grid */}
              <div className="mb-8">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-slate-600 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Date buttons */}
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() =>
                        handleDateSelect(date.toISOString().split("T")[0])
                      }
                      className={`p-3 rounded-lg font-medium text-sm transition ${
                        selectedDate === date.toISOString().split("T")[0]
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Available times
                  </h3>
                  {slots.length > 0 ? (
                    <SlotsGrid
                      slots={slots}
                      onSelectSlot={handleSelectSlot}
                      selectedSlot={selectedSlot}
                    />
                  ) : (
                    <p className="text-slate-600 text-center py-8">
                      No available times on this date
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Booking Details Form
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              {bookingSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-slate-600 mb-2">
                    Check your email for confirmation details
                  </p>
                  <p className="text-sm text-slate-500">
                    Redirecting in a moment...
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="text-blue-600 font-medium text-sm mb-6 hover:text-blue-700"
                  >
                    ← Change time
                  </button>

                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Confirm your booking
                  </h2>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-8 border border-blue-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-slate-600">Date</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(selectedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-slate-600">Time</p>
                          <p className="font-semibold text-slate-900">
                            {selectedSlot.start} - {selectedSlot.end}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <User className="w-4 h-4 inline-block mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Mail className="w-4 h-4 inline-block mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {event.custom_questions && event.custom_questions.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Additional Information
                        </label>
                        <div className="space-y-3">
                          {event.custom_questions.map((question, idx) => (
                            <div key={idx}>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                {question}
                              </label>
                              <textarea
                                value={
                                  bookingData.guest_notes
                                    ? JSON.parse(bookingData.guest_notes || "{}")[question] || ""
                                    : ""
                                }
                                onChange={(e) => {
                                  try {
                                    const notes =
                                      bookingData.guest_notes && bookingData.guest_notes !== ""
                                        ? JSON.parse(bookingData.guest_notes)
                                        : {};
                                    notes[question] = e.target.value;
                                    setBookingData({
                                      ...bookingData,
                                      guest_notes: JSON.stringify(notes),
                                    });
                                  } catch {
                                    const notes = { [question]: e.target.value };
                                    setBookingData({
                                      ...bookingData,
                                      guest_notes: JSON.stringify(notes),
                                    });
                                  }
                                }}
                                placeholder="Your answer..."
                                rows="2"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleBooking}
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookingPage;