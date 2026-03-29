import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Mail,
  X,
  Trash2,
  Edit,
  Share2,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  MapPin,
} from "lucide-react";

function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("all");
  const [rescheduling, setRescheduling] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [rescheduling_loading, setReschedulingLoading] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, eventsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/bookings"),
        axios.get("http://localhost:5000/api/events"),
      ]);

      setBookings(bookingsRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setDeleting(id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/bookings/${id}`
      );
      console.log("Delete response:", response.data);

      // Refresh the bookings list
      await fetchData();
      setSelectedBooking(null);

      // Show success message
      alert("✅ Booking cancelled successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("❌ Failed to cancel booking. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleReschedule = async (booking) => {
    setRescheduling(booking);
    setNewDate(booking.date);
    setSelectedNewSlot(null);
    setAvailableSlots([]);
  };

  const fetchNewSlots = async () => {
    if (!newDate || !rescheduling) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/slots?eventId=${rescheduling.event_id}&date=${newDate}`
      );
      setAvailableSlots(res.data || []);
      setSelectedNewSlot(null);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const confirmReschedule = async () => {
    if (!selectedNewSlot || !newDate) {
      alert("Please select a new date and time");
      return;
    }

    setReschedulingLoading(true);
    try {
      // Delete old booking and create new one
      await axios.delete(
        `http://localhost:5000/api/bookings/${rescheduling.id}`
      );
      await axios.post("http://localhost:5000/api/bookings", {
        event_id: rescheduling.event_id,
        date: newDate,
        start_time: selectedNewSlot.start,
        end_time: selectedNewSlot.end,
        name: rescheduling.name,
        email: rescheduling.email,
        guest_notes: rescheduling.guest_notes,
      });

      // Refresh bookings
      await fetchData();
      setRescheduling(null);
      setSelectedBooking(null);
      alert("✅ Booking rescheduled successfully!");
    } catch (error) {
      console.error("Error rescheduling:", error);
      alert("❌ Failed to reschedule booking");
    } finally {
      setReschedulingLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "upcoming") {
      return new Date(booking.date) >= new Date();
    }
    if (filter === "past") {
      return new Date(booking.date) < new Date();
    }
    return true;
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => new Date(b.date) >= new Date()).length,
    totalEvents: events.length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="fade-in mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-xl text-slate-600">
            Manage your meetings and events
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {/* Total Meetings */}
          <div className="slide-in-left bg-white rounded-2xl p-6 shadow-sm border border-slate-200 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Meetings
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="slide-in-left bg-white rounded-2xl p-6 shadow-sm border border-slate-200 card-hover animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Upcoming
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.upcoming}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Event Types */}
          <div className="slide-in-left bg-white rounded-2xl p-6 shadow-sm border border-slate-200 card-hover animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Event Types
                </p>
                <p className="text-4xl font-bold text-purple-600">
                  {stats.totalEvents}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-2xl">
                <Share2 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="slide-in-left bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-sm card-hover animation-delay-300">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-2">
                  Ready to go?
                </p>
                <a href="/events" className="text-white font-semibold text-sm hover:underline">
                  Create Event →
                </a>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <ChevronDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="fade-in">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                >
                  Refresh
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-3 flex-wrap">
                {["all", "upcoming", "past"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-2.5 rounded-xl font-medium transition ${
                      filter === tab
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tab === "all"
                      ? "All Meetings"
                      : tab === "upcoming"
                      ? "Upcoming"
                      : "Past"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-slate-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full"></div>
                  <p className="text-slate-600 mt-4">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    No bookings
                  </h3>
                  <p className="text-slate-500">
                    {filter === "all"
                      ? "Share your booking link to get started"
                      : `No ${filter} bookings`}
                  </p>
                </div>
              ) : (
                filteredBookings.map((booking, idx) => {
                  const event = events.find((e) => e.id === booking.event_id);
                  const bookingDate = new Date(booking.date);
                  const isUpcoming = bookingDate >= new Date();

                  return (
                    <div
                      key={booking.id}
                      className={`p-6 hover:bg-slate-50 transition fade-in-up ${
                        expandedBooking === booking.id ? "bg-blue-50" : ""
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        onClick={() =>
                          setExpandedBooking(
                            expandedBooking === booking.id ? null : booking.id
                          )
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {event?.name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  isUpcoming
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {isUpcoming ? "Upcoming" : "Past"}
                              </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {bookingDate.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {booking.start_time} - {booking.end_time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <User className="w-4 h-4" />
                                <span>{booking.name}</span>
                              </div>
                            </div>
                          </div>

                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition ${
                              expandedBooking === booking.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedBooking === booking.id && (
                        <div className="mt-6 pt-6 border-t border-slate-200 fade-in">
                          <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <div className="text-sm">
                                <p className="text-slate-600">Email</p>
                                <p className="font-medium text-slate-900">
                                  {booking.email}
                                </p>
                              </div>
                            </div>

                            {booking.guest_notes && (
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <p className="text-sm text-slate-600 mb-1">
                                  Guest Notes
                                </p>
                                <p className="text-slate-900 text-sm">
                                  {typeof booking.guest_notes === "string"
                                    ? booking.guest_notes.length > 50
                                      ? booking.guest_notes.substring(0, 50) +
                                        "..."
                                      : booking.guest_notes
                                    : JSON.stringify(booking.guest_notes)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              View Details
                            </button>
                            {isUpcoming && (
                              <>
                                <button
                                  onClick={() => handleReschedule(booking)}
                                  className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition flex items-center justify-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  disabled={deleting === booking.id}
                                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {deleting === booking.id ? (
                                    <>
                                      <div className="animate-spin w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full"></div>
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4" />
                                      Cancel
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 modal-enter">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {(() => {
              const event = events.find(
                (e) => e.id === selectedBooking.event_id
              );
              const bookingDate = new Date(selectedBooking.date);
              const isUpcoming = bookingDate >= new Date();

              return (
                <div className="space-y-6">
                  {/* Event Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {event?.name}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Date</p>
                          <p className="font-semibold text-slate-900">
                            {bookingDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Time</p>
                          <p className="font-semibold text-slate-900">
                            {selectedBooking.start_time} -{" "}
                            {selectedBooking.end_time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Guest</p>
                          <p className="font-semibold text-slate-900">
                            {selectedBooking.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Email</p>
                          <p className="font-semibold text-slate-900 truncate">
                            {selectedBooking.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guest Notes */}
                  {selectedBooking.guest_notes && (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-sm font-semibold text-slate-600 mb-3">
                        Additional Information
                      </p>
                      <p className="text-slate-900 text-sm whitespace-pre-wrap">
                        {selectedBooking.guest_notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition"
                    >
                      Close
                    </button>
                    {isUpcoming && (
                      <>
                        <button
                          onClick={() => {
                            handleReschedule(selectedBooking);
                            setSelectedBooking(null);
                          }}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Reschedule
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteBooking(selectedBooking.id);
                            setSelectedBooking(null);
                          }}
                          disabled={deleting === selectedBooking.id}
                          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Rescheduling Modal */}
      {rescheduling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 modal-enter">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Reschedule Booking
              </h2>
              <button
                onClick={() => setRescheduling(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setAvailableSlots([]);
                    setSelectedNewSlot(null);
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {newDate && (
                <button
                  onClick={fetchNewSlots}
                  className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
                >
                  Find Available Times
                </button>
              )}

              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedNewSlot(slot)}
                        className={`py-2 px-3 rounded-lg border-2 font-medium transition ${
                          selectedNewSlot?.start === slot.start
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-300 text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        {slot.start}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setRescheduling(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  disabled={!selectedNewSlot || rescheduling_loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {rescheduling_loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Rescheduling...
                    </>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
      `}</style>
    </main>
  );
}

export default DashboardPage;
