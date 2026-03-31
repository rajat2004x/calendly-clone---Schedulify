import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Copy, Check, Calendar } from "lucide-react";
import AvailabilitySettings from "../components/AvailabilitySettings";

function EventSetupPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    description: "",
    buffer_time: 0,
    custom_questions: [],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [editNewQuestion, setEditNewQuestion] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!formData.name.trim()) {
      alert("Event name is required");
      return;
    }

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, "-");
      const res = await axios.post("/api/events", {
        ...formData,
        slug,
      });

      setEvents([...events, res.data]);
      setFormData({ name: "", duration: 30, description: "", buffer_time: 0, custom_questions: [] });
      setNewQuestion("");
      setShowForm(false);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete event:", id);
    if (!window.confirm("Are you sure you want to delete this event and all associated bookings?")) return;

    setDeletingId(id);
    try {
      console.log("Calling DELETE /api/events/" + id);
      const response = await axios.delete(`/api/events/${id}`);
      console.log("Delete response:", response);
      setEvents(events.filter((e) => e.id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      const errorMsg = error.response?.data?.error || error.message || "Failed to delete event";
      alert(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (event) => {
    setEditingId(event.id);
    setEditFormData({
      name: event.name,
      duration: event.duration,
      description: event.description || "",
      buffer_time: event.buffer_time || 0,
      custom_questions: event.custom_questions || [],
    });
    setEditNewQuestion("");
  };

  const handleUpdateEvent = async () => {
    if (!editFormData.name.trim()) {
      alert("Event name is required");
      return;
    }

    try {
      const response = await axios.put(
        `/api/events/${editingId}`,
        editFormData
      );
      setEvents(events.map((e) => (e.id === editingId ? response.data : e)));
      setEditingId(null);
      setEditFormData(null);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert(error.response?.data?.error || "Failed to update event");
    }
  };

  const copyShareLink = (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Event Types
        </h1>
        <p className="text-lg text-slate-600">
          Create and manage different types of meetings and appointments
        </p>
      </div>

      {/* Add Event Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Event Type
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Create New Event Type
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., 30 Minute Meeting"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What is this meeting about?"
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.buffer_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buffer_time: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Gap before next meeting (e.g., 15)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Adds a gap after each meeting to prevent back-to-back bookings
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Custom Questions for Guests
              </label>
              <div className="space-y-2">
                {formData.custom_questions.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={q}
                      readOnly
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                    />
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          custom_questions: formData.custom_questions.filter(
                            (_, index) => index !== i
                          ),
                        });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newQuestion.trim()) {
                        setFormData({
                          ...formData,
                          custom_questions: [
                            ...formData.custom_questions,
                            newQuestion,
                          ],
                        });
                        setNewQuestion("");
                      }
                    }}
                    placeholder='e.g., "What would you like to discuss?"'
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newQuestion.trim()) {
                        setFormData({
                          ...formData,
                          custom_questions: [
                            ...formData.custom_questions,
                            newQuestion,
                          ],
                        });
                        setNewQuestion("");
                      }
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Press Enter or click Add to add custom questions
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddEvent}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Event
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No event types yet
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first event type to start accepting bookings
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Event Type
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {event.name}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {event.duration} minute meeting
                  </p>
                </div>
                <div className="flex gap-2">
                  <AvailabilitySettings eventId={event.id} />
                  <button
                    onClick={() => copyShareLink(event.slug)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900"
                    title="Copy booking link"
                  >
                    {copiedId === event.slug ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditStart(event)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition text-slate-600 hover:text-blue-600"
                    title="Edit event"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-slate-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === event.id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {event.description && (
                <p className="text-slate-600 mb-4">{event.description}</p>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Share link:{" "}
                  <span className="font-mono text-blue-600">
                    /book/{event.slug}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingId && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Edit Event Type
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={editFormData.duration}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buffer Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={editFormData.buffer_time}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      buffer_time: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Questions
                </label>
                <div className="space-y-2">
                  {editFormData.custom_questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={q}
                        readOnly
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                      />
                      <button
                        onClick={() => {
                          setEditFormData({
                            ...editFormData,
                            custom_questions: editFormData.custom_questions.filter(
                              (_, index) => index !== i
                            ),
                          });
                        }}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editNewQuestion}
                      onChange={(e) => setEditNewQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && editNewQuestion.trim()) {
                          setEditFormData({
                            ...editFormData,
                            custom_questions: [
                              ...editFormData.custom_questions,
                              editNewQuestion,
                            ],
                          });
                          setEditNewQuestion("");
                        }
                      }}
                      placeholder='e.g., "What would you like to discuss?"'
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={() => {
                        if (editNewQuestion.trim()) {
                          setEditFormData({
                            ...editFormData,
                            custom_questions: [
                              ...editFormData.custom_questions,
                              editNewQuestion,
                            ],
                          });
                          setEditNewQuestion("");
                        }
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateEvent}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditFormData(null);
                  }}
                  className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default EventSetupPage;
