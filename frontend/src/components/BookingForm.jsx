import { useState, memo } from "react";
import axios from "axios";

const BookingForm = memo(function BookingForm({ slot, date }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleBooking = async () => {
    try {
      await axios.post(
  "/api/bookings",
  {
    event_type_id: 1,
    date,
    start_time: slot.start,
    end_time: slot.end,
    name,
  },
  {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }
);

      alert("Booking Confirmed ✅");

    }catch (err) {
  console.error(err.response?.data || err.message);
  alert("Error booking ❌");
}
  };

  return (
    <div className="space-y-4">

      <p className="text-gray-600">
        Booking <b>{slot.start}</b> on <b>{date}</b>
      </p>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleBooking}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Confirm Booking
      </button>

    </div>
  );
});

export default BookingForm;