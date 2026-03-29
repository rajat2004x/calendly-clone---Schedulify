
import { useState } from "react";

const dummyEvents = [
  {
    id: "dummy-1",
    name: "Doctor Appointment",
    description: "Book a consultation with a doctor.",
    duration: 30,
    type: "dummy",
  },
  {
    id: "dummy-2",
    name: "Museum Tour",
    description: "Reserve a slot for a guided museum tour.",
    duration: 60,
    type: "dummy",
  },
  {
    id: "dummy-3",
    name: "Yoga Class",
    description: "Join a group yoga session.",
    duration: 45,
    type: "dummy",
  },
];


function generateSlots(duration, buffer = 0, bookings = [], dateStr = "") {
  // 9:00 to 17:00, slots of 'duration' minutes, with buffer
  const slots = [];
  const startMinutes = 9 * 60;
  const endMinutes = 17 * 60;
  for (let mins = startMinutes; mins + duration <= endMinutes; ) {
    const startHour = Math.floor(mins / 60);
    const startMin = mins % 60;
    const endHour = Math.floor((mins + duration) / 60);
    const endMin = (mins + duration) % 60;
    const start = `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`;
    const end = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
    // Check for buffer/overlap with existing bookings
    const isBooked = bookings.some(b => b.date === dateStr && (
      (start >= b.start && start < b.end) || (end > b.start && end <= b.end)
    ));
    slots.push({ start, end, available: !isBooked });
    mins += duration + buffer;
  }
  return slots;
}


import { useNavigate } from "react-router-dom";

function getDummyBookings() {
  try {
    return JSON.parse(localStorage.getItem("dummyBookings") || "[]");
  } catch {
    return [];
  }
}
function setDummyBookings(bookings) {
  localStorage.setItem("dummyBookings", JSON.stringify(bookings));
}

function DummyBookingPage() {
  const [selectedEvent] = useState(dummyEvents[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({ name: "", email: "" });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [buffer] = useState(10); // buffer time in minutes (can be dynamic)
  const navigate = useNavigate();

  // Dates: next 30 days
  const today = new Date();
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Booking history
  const bookings = getDummyBookings();

  // Slots for the event
  const slots = generateSlots(selectedEvent.duration, buffer, bookings, selectedDate);

  const handleBooking = () => {
    if (!bookingData.name.trim() || !bookingData.email.trim() || !selectedDate || !selectedSlot) return;
    // Save booking to localStorage
    const newBooking = {
      id: new Date().getTime(),
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      date: selectedDate,
      start: selectedSlot.start,
      end: selectedSlot.end,
      name: bookingData.name,
      email: bookingData.email,
      status: "confirmed",
      type: "dummy",
    };
    setDummyBookings([...bookings, newBooking]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSlot(null);
      setBookingData({ name: "", email: "" });
      setSelectedDate("");
      navigate("/user-dashboard");
    }, 1500);
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">{selectedEvent.name}</h1>
        <p className="text-slate-600 mb-4">{selectedEvent.description}</p>
        <p className="text-slate-500 mb-6">Duration: {selectedEvent.duration} min</p>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-700">Select a date</label>
          <div className="grid grid-cols-7 gap-2">
            {availableDates.map((date) => {
              const dateStr = date.toISOString().split("T")[0];
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2 rounded-lg text-sm font-medium transition ${
                    selectedDate === dateStr
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-slate-700">Select a time</label>
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.start + slot.end}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`py-2 px-3 rounded-lg border-2 font-medium transition ${
                    !slot.available
                      ? "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                      : selectedSlot?.start === slot.start
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {slot.start} - {slot.end}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {selectedSlot && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-slate-700">Your Details</label>
            <input
              type="text"
              placeholder="Full Name"
              value={bookingData.name}
              onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
              className="w-full mb-3 px-4 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={bookingData.email}
              onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
              className="w-full mb-3 px-4 py-2 border border-slate-300 rounded-lg"
            />
            <button
              onClick={handleBooking}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={bookingSuccess}
            >
              {bookingSuccess ? "Booking..." : "Book Now"}
            </button>
          </div>
        )}

        {/* Success Message */}
        {bookingSuccess && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
            <p className="text-slate-600">Thank you for booking. This is a demo event.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default DummyBookingPage;
