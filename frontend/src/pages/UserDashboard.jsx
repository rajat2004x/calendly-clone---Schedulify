import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


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


function UserDashboard() {
  const [realEvents, setRealEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dummyBookings, setDummyBookingsState] = useState([]);
  const [realBookings, setRealBookings] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setRealEvents(Array.isArray(data) ? data : []);
      } catch {
        setRealEvents([]);
      } finally {
        setLoading(false);
      }
    }
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setRealBookings(Array.isArray(data) ? data : []);
      } catch {
        setRealBookings([]);
      }
    }
    fetchEvents();
    fetchBookings();
    setDummyBookingsState(getDummyBookings().sort((a, b) => b.id - a.id));
  }, []);

  const handleCancelDummy = (id) => {
    const updated = dummyBookings.filter(b => b.id !== id);
    setDummyBookings(updated);
    setDummyBookingsState(updated);
  };


  // Fetch slots for reschedule
  const fetchRescheduleSlots = async (eventId, dateStr) => {
    setRescheduleSlots([]);
    setRescheduleSlot(null);
    if (!eventId || !dateStr) return;
    setRescheduleLoading(true);
    try {
      const res = await axios.get(`/api/availability/${eventId}?date=${dateStr}`);
      setRescheduleSlots(res.data || []);
    } catch {
      setRescheduleSlots([]);
    } finally {
      setRescheduleLoading(false);
    }
  };

  // Handle reschedule submit
  const handleReschedule = async () => {
    if (!rescheduleId || !rescheduleDate || !rescheduleSlot) return;
    await axios.put(`/api/bookings/${rescheduleId}/reschedule`, {
      date: rescheduleDate,
      start_time: rescheduleSlot.start,
      end_time: rescheduleSlot.end,
    });
    setRealBookings(
      realBookings.map((b) =>
        b.id === rescheduleId
          ? { ...b, date: rescheduleDate, start_time: rescheduleSlot.start, end_time: rescheduleSlot.end }
          : b
      )
    );
    setRescheduleId(null);
    setRescheduleDate("");
    setRescheduleSlots([]);
    setRescheduleSlot(null);
  };

  return (
    <main className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-blue-700">Book an Event</h1>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold mb-2">Your Bookings</h2>
        {/* Dummy Bookings */}
        {dummyBookings.length > 0 && (
          <div className="overflow-x-auto mb-4 sm:mb-6 rounded-lg border border-slate-200 bg-white">
            <table className="min-w-[480px] w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border">Event</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyBookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-2 border">{b.eventName}</td>
                    <td className="p-2 border">{b.date}</td>
                    <td className="p-2 border">{b.start} - {b.end}</td>
                    <td className="p-2 border">{b.status}</td>
                    <td className="p-2 border">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleCancelDummy(b.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Real Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center text-slate-500">Loading events...</div>
          ) : realEvents.length === 0 ? (
            <div className="col-span-2 text-center text-slate-400">No real events available yet.</div>
          ) : (
            realEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow p-4 sm:p-6 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">{event.name}</h2>
                  <p className="text-slate-600 mb-1 sm:mb-2 text-xs sm:text-sm">{event.description}</p>
                  <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-4">Duration: {event.duration} min</p>
                </div>
                <Link
                  to={`/book/real/${event.id}`}
                  className="mt-auto py-2 px-3 sm:px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm sm:text-base"
                >
                  Book Now
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>
            <label className="block mb-2 text-sm font-medium">Select new date</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={e => {
                setRescheduleDate(e.target.value);
                const booking = realBookings.find(b => b.id === rescheduleId);
                fetchRescheduleSlots(booking.event_id || booking.event_type_id, e.target.value);
              }}
              className="border px-3 py-2 rounded w-full mb-4"
            />
            {rescheduleDate && (
              <>
                <label className="block mb-2 text-sm font-medium">Select new time</label>
                {rescheduleLoading ? (
                  <div className="text-slate-500 py-4">Loading slots...</div>
                ) : rescheduleSlots.length === 0 ? (
                  <div className="text-slate-400 py-4">No available slots</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {rescheduleSlots.map(slot => (
                      <button
                        key={slot.start + slot.end}
                        onClick={() => setRescheduleSlot(slot)}
                        className={`py-2 px-3 rounded border font-medium transition ${
                          rescheduleSlot?.start === slot.start
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                disabled={!rescheduleSlot}
                onClick={handleReschedule}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-semibold"
                onClick={() => setRescheduleId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default UserDashboard;
