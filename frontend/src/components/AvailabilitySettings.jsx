import { useState } from "react";
import { Clock, Plus, Trash2, X } from "lucide-react";

function AvailabilitySettings({ eventId }) {
  const [showModal, setShowModal] = useState(false);
  const [availability, setAvailability] = useState([
    { day: "monday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "tuesday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "wednesday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "thursday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "friday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "saturday", startTime: "", endTime: "", enabled: false },
    { day: "sunday", startTime: "", endTime: "", enabled: false },
  ]);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  // Date-specific overrides
  const [dateOverrides, setDateOverrides] = useState([]); // [{date: '2026-04-01', startTime: '10:00', endTime: '14:00'}]
  const [newOverride, setNewOverride] = useState({ date: "", startTime: "09:00", endTime: "17:00" });

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  const timezones = [
    "Asia/Kolkata",
    "Asia/Delhi",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Hong_Kong",
    "Asia/Singapore",
    "Australia/Sydney",
    "Australia/Melbourne",
    "UTC",
  ];

  const handleTimeChange = (day, field, value) => {
    setAvailability(
      availability.map((slot) =>
        slot.day === day ? { ...slot, [field]: value } : slot
      )
    );
  };

  const toggleDay = (day) => {
    setAvailability(
      availability.map((slot) =>
        slot.day === day ? { ...slot, enabled: !slot.enabled } : slot
      )
    );
  };

  const handleSave = () => {
    // Save to localStorage for now, in production would save to backend
    localStorage.setItem(
      `availability-${eventId}`,
      JSON.stringify({ availability, timezone, dateOverrides })
    );
    localStorage.setItem("userTimezone", timezone);
    alert("Availability settings saved!");
    setShowModal(false);
  };

  const handleAddOverride = () => {
    if (!newOverride.date) return;
    setDateOverrides([...dateOverrides, newOverride]);
    setNewOverride({ date: "", startTime: "09:00", endTime: "17:00" });
  };

  const handleRemoveOverride = (date) => {
    setDateOverrides(dateOverrides.filter((o) => o.date !== date));
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
      >
        <Clock className="w-5 h-5" />
        Set Availability
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Set Your Availability
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Timezone Selector */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Your Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-600 mt-2">
                Guests will see available times in their own timezone
              </p>
            </div>

            {/* Working Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Working Hours
              </h3>


              {days.map((day) => {
                const slot = availability.find((s) => s.day === day);
                return (
                  <div
                    key={day}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Day Toggle */}
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={slot.enabled}
                          onChange={() => toggleDay(day)}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700 capitalize w-20">
                          {day}
                        </span>
                      </div>
                      {/* Time Inputs */}
                      {slot.enabled ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleTimeChange(day, "startTime", e.target.value)
                            }
                            className="px-3 py-2 border border-slate-300 rounded text-sm"
                          />
                          <span className="text-slate-600">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleTimeChange(day, "endTime", e.target.value)
                            }
                            className="px-3 py-2 border border-slate-300 rounded text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 italic">
                          Not available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Date-specific overrides */}
              <div className="mt-8">
                <h4 className="font-semibold mb-2 text-slate-800">Date-Specific Hours (Overrides)</h4>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="date"
                    value={newOverride.date}
                    onChange={e => setNewOverride({ ...newOverride, date: e.target.value })}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="time"
                    value={newOverride.startTime}
                    onChange={e => setNewOverride({ ...newOverride, startTime: e.target.value })}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="time"
                    value={newOverride.endTime}
                    onChange={e => setNewOverride({ ...newOverride, endTime: e.target.value })}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddOverride}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {dateOverrides.length > 0 && (
                  <div className="space-y-2">
                    {dateOverrides.map((o) => (
                      <div key={o.date} className="flex items-center gap-2 text-sm">
                        <span className="font-mono">{o.date}</span>
                        <span>{o.startTime} - {o.endTime}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOverride(o.date)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AvailabilitySettings;
