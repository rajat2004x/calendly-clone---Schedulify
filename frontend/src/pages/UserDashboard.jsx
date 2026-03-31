import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  X,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Seed bookings visible in the Scheduled Events list.
const FAKE_BOOKINGS = [
  {
    id: "f1",
    eventName: "30 Minute Consultation",
    eventColor: "#0069ff",
    invitee: "Rahul Sharma",
    inviteeEmail: "rahul.sharma@example.com",
    date: "2026-04-04",
    start_time: "10:00",
    end_time: "10:30",
    duration: 30,
    location: "Zoom",
    locationType: "video",
    meetingLink: "https://zoom.us/j/123456789",
    status: "active",
    notes: "Discuss project requirements and timeline for the new platform.",
  },
  {
    id: "f2",
    eventName: "1 Hour Strategy Session",
    eventColor: "#7c3aed",
    invitee: "Priya Mehta",
    inviteeEmail: "priya.mehta@example.com",
    date: "2026-04-08",
    start_time: "14:00",
    end_time: "15:00",
    duration: 60,
    location: "Google Meet",
    locationType: "video",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "active",
    notes: "Q2 marketing campaign planning and budget review.",
  },
  {
    id: "f3",
    eventName: "15 Min Quick Sync",
    eventColor: "#059669",
    invitee: "Ankit Verma",
    inviteeEmail: "ankit.v@example.com",
    date: "2026-04-12",
    start_time: "09:15",
    end_time: "09:30",
    duration: 15,
    location: "Microsoft Teams",
    locationType: "video",
    meetingLink: "https://teams.microsoft.com/l/meetup/xyz",
    status: "active",
    notes: "",
  },
  {
    id: "f4",
    eventName: "Product Demo",
    eventColor: "#d97706",
    invitee: "Sneha Kapoor",
    inviteeEmail: "sneha.k@example.com",
    date: "2026-04-17",
    start_time: "11:00",
    end_time: "11:45",
    duration: 45,
    location: "Zoom",
    locationType: "video",
    meetingLink: "https://zoom.us/j/987654321",
    status: "active",
    notes: "New dashboard features walkthrough and Q&A.",
  },
  // Past
  {
    id: "f5",
    eventName: "Onboarding Call",
    eventColor: "#0069ff",
    invitee: "Rohan Das",
    inviteeEmail: "rohan.das@example.com",
    date: "2026-03-20",
    start_time: "10:00",
    end_time: "10:30",
    duration: 30,
    location: "Zoom",
    locationType: "video",
    meetingLink: "",
    status: "active",
    notes: "Initial onboarding and platform setup walkthrough.",
  },
  {
    id: "f6",
    eventName: "Design Review",
    eventColor: "#db2777",
    invitee: "Kavya Nair",
    inviteeEmail: "kavya.n@example.com",
    date: "2026-03-25",
    start_time: "15:00",
    end_time: "16:00",
    duration: 60,
    location: "Google Meet",
    locationType: "video",
    meetingLink: "",
    status: "active",
    notes: "Reviewed new landing page design and component library.",
  },
  {
    id: "f7",
    eventName: "Budget Discussion",
    eventColor: "#0891b2",
    invitee: "Amit Joshi",
    inviteeEmail: "amit.j@example.com",
    date: "2026-03-28",
    start_time: "13:00",
    end_time: "13:30",
    duration: 30,
    location: "Phone Call",
    locationType: "phone",
    meetingLink: "",
    status: "cancelled",
    notes: "",
  },
];

const DOCTOR_BOOKING_TYPES = [
  {
    id: "d1",
    doctorName: "Dr. Meera Kapoor",
    specialty: "Dermatologist",
    eventName: "Skin Consultation",
    duration: 30,
    buffer: 5,
    eventColor: "#0b57d0",
    location: "Zoom",
    description: "Discuss skin concerns, treatment options, and care routine.",
    availability: {
      1: { start: "09:30", end: "12:30" },
      2: { start: "10:00", end: "13:00" },
      3: { start: "09:00", end: "12:00" },
      4: { start: "11:00", end: "15:00" },
      5: { start: "09:30", end: "12:30" },
    },
  },
  {
    id: "d2",
    doctorName: "Dr. Arjun Nair",
    specialty: "Cardiologist",
    eventName: "Heart Health Follow-up",
    duration: 45,
    buffer: 5,
    eventColor: "#2563eb",
    location: "Google Meet",
    description: "Review reports, medicine plan, and lifestyle guidance.",
    availability: {
      1: { start: "09:00", end: "13:00" },
      2: { start: "10:00", end: "14:00" },
      3: { start: "09:30", end: "13:30" },
      4: { start: "11:00", end: "15:00" },
      5: { start: "08:30", end: "12:30" },
    },
  },
  {
    id: "d3",
    doctorName: "Dr. Neha Bansal",
    specialty: "Pediatrician",
    eventName: "Child Wellness Check",
    duration: 20,
    buffer: 5,
    eventColor: "#059669",
    location: "Microsoft Teams",
    description: "Routine child health checkup and growth consultation.",
    availability: {
      1: { start: "09:00", end: "12:00" },
      2: { start: "10:00", end: "13:00" },
      3: { start: "09:30", end: "12:30" },
      4: { start: "11:00", end: "14:00" },
      5: { start: "09:00", end: "12:00" },
    },
  },
  {
    id: "d4",
    doctorName: "Dr. Rohan Sethi",
    specialty: "Orthopedic",
    eventName: "Joint Pain Consultation",
    duration: 40,
    buffer: 5,
    eventColor: "#7c3aed",
    location: "Zoom",
    description: "Assess pain symptoms and discuss recovery plan.",
    availability: {
      1: { start: "09:00", end: "13:00" },
      2: { start: "10:00", end: "14:00" },
      3: { start: "09:30", end: "13:30" },
      4: { start: "11:00", end: "15:00" },
      5: { start: "09:00", end: "13:00" },
    },
  },
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIsoLocal(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const TODAY = toIsoLocal(new Date());

function formatDateLong(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}
function formatDateShort(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}
function formatTime12(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${ampm}`;
}
function addMinutes(time, minutesToAdd) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutesToAdd;
  const nextH = Math.floor((total % (24 * 60)) / 60);
  const nextM = total % 60;
  return `${String(nextH).padStart(2, "0")}:${String(nextM).padStart(2, "0")}`;
}
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
function generateBufferedSlots(windowStart, windowEnd, duration, buffer) {
  const slots = [];
  let currentStart = windowStart;

  while (toMinutes(addMinutes(currentStart, duration)) <= toMinutes(windowEnd)) {
    const end = addMinutes(currentStart, duration);
    slots.push({ start: currentStart, end });
    currentStart = addMinutes(end, buffer);
  }

  return slots;
}
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function getNextBookableDate(availability) {
  const start = new Date(TODAY + "T12:00:00");
  for (let i = 0; i < 730; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const day = d.getDay();
    if (availability[day]) return toIsoLocal(d);
  }
  return "";
}

function getCalendarCells(monthDate, availability) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const offset = first.getDay();

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const cellDate = new Date(year, month, i - offset + 1);
    const iso = toIsoLocal(cellDate);
    const inMonth = cellDate.getMonth() === month;
    const isPast = iso < TODAY;
    const isBookable = inMonth && !isPast && Boolean(availability[cellDate.getDay()]);

    cells.push({
      iso,
      dayNumber: cellDate.getDate(),
      inMonth,
      isBookable,
    });
  }
  return cells;
}

function CopyBtn({ text, label = "Copy" }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      className="inline-flex items-center gap-1 text-xs text-[#0069ff] hover:underline font-medium"
    >
      {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

function DetailDrawer({ booking, onClose, onCancel, onDelete }) {
  if (!booking) return null;
  const isCancelled = booking.status === "cancelled";
  const isActive = booking.date >= TODAY && !isCancelled;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      {/* panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
        {/* Top coloured bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: booking.eventColor }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Event Details
          </span>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Event name + status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: booking.eventColor }}
              />
              <span className="text-xs text-gray-500 font-medium">{booking.duration} min meeting</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">{booking.eventName}</h2>
            {isCancelled && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                Cancelled
              </span>
            )}
            {!isActive && !isCancelled && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-semibold">
                Completed
              </span>
            )}
            {isActive && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                Confirmed
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Date & time */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                <p className="text-sm font-semibold text-gray-900">{formatDateLong(booking.date)}</p>
                <p className="text-sm text-gray-600">
                  {formatTime12(booking.start_time)} - {formatTime12(booking.end_time)}
                  <span className="text-gray-400 ml-1">({booking.duration} min)</span>
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              {booking.locationType === "phone"
                ? <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                : <Video className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              }
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm font-semibold text-gray-900">{booking.location}</p>
                {booking.meetingLink && isActive && (
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0069ff] hover:underline font-medium flex items-center gap-1"
                    >
                      Join <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-gray-300">.</span>
                    <CopyBtn text={booking.meetingLink} label="Copy link" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Invitee */}
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: booking.eventColor }}
            >
              {initials(booking.invitee)}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Invitee</p>
              <p className="text-sm font-semibold text-gray-900">{booking.invitee}</p>
              <p className="text-xs text-gray-500">{booking.inviteeEmail}</p>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <>
              <hr className="border-gray-100" />
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Notes from invitee</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-2">
          {isActive && booking.meetingLink && (
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0069ff] hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
            >
              <Video className="w-4 h-4" /> Join Meeting
            </a>
          )}
          {isActive && (
            <button
              onClick={() => { onCancel(booking.id); onClose(); }}
              className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-medium text-sm transition"
            >
              Cancel Event
            </button>
          )}
          <button
            onClick={() => { onDelete(booking.id); onClose(); }}
            className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-medium text-sm transition"
          >
            Delete Event
          </button>
          {!isActive && (
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-medium text-sm transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function BookingRow({ booking, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isCancelled = booking.status === "cancelled";

  return (
    <div
      className={`group flex items-stretch border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
        hovered ? "bg-gray-50" : "bg-white"
      } ${isCancelled ? "opacity-60" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Coloured left accent */}
      <div className="w-1 flex-shrink-0 rounded-sm my-3 ml-4" style={{ background: booking.eventColor }} />

      {/* Main content */}
      <div className="flex-1 px-4 py-4 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: event & invitee */}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{booking.eventName}</p>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{booking.invitee}</p>
            {/* Meta pills */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {booking.duration} min
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                {booking.locationType === "phone"
                  ? <Phone className="w-3 h-3" />
                  : <Video className="w-3 h-3" />
                }
                {booking.location}
              </span>
              {isCancelled && (
                <span className="text-xs text-red-500 font-medium">Cancelled</span>
              )}
            </div>
          </div>

          {/* Right: date + time */}
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-gray-800">{formatDateShort(booking.date)}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatTime12(booking.start_time)} - {formatTime12(booking.end_time)}
            </p>
          </div>
        </div>
      </div>

      {/* Chevron */}
      <div className="flex items-center pr-4 pl-1 text-gray-300 group-hover:text-gray-500 transition">
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function BookingPickerModal({ doctor, onClose, onConfirm }) {
  const initialDate = doctor ? getNextBookableDate(doctor.availability) : "";
  const [selectedDate, setSelectedDate] = useState(() => initialDate);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const seed = initialDate ? new Date(initialDate + "T12:00:00") : new Date(TODAY + "T12:00:00");
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });

  if (!doctor) return null;

  const yearOptions = [];
  const baseYear = new Date(TODAY + "T12:00:00").getFullYear();
  for (let y = baseYear; y <= baseYear + 3; y += 1) yearOptions.push(y);

  const cells = getCalendarCells(calendarMonth, doctor.availability);
  const selectedDay = selectedDate ? new Date(selectedDate + "T12:00:00").getDay() : -1;
  const selectedWindow = selectedDay >= 0 ? doctor.availability[selectedDay] : null;
  const slots = selectedWindow
    ? generateBufferedSlots(selectedWindow.start, selectedWindow.end, doctor.duration, doctor.buffer || 5)
    : [];

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 p-3 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200 shadow-[0_20px_90px_rgba(2,6,23,0.28)] overflow-hidden">
          <div className="grid lg:grid-cols-[320px_1fr] min-h-[620px]">
            <div className="relative p-7 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gradient-to-b from-white to-[#f9fbff]">
              <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>

              <div
                className="w-8 h-8 rounded-xl mb-5"
                style={{ background: doctor.eventColor }}
              />

              <p className="text-xs uppercase tracking-[0.14em] text-gray-400 font-semibold">Book Appointment</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-3 leading-tight">{doctor.eventName}</h3>
              <p className="text-base text-gray-600 mt-2">{doctor.doctorName}</p>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>

              <div className="mt-8 space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {doctor.duration} min</p>
                <p className="flex items-center gap-2"><Video className="w-4 h-4" /> {doctor.location}</p>
              </div>

              <div className="mt-8 space-y-2">
                <div className="h-2 rounded bg-gray-100" />
                <div className="h-2 rounded bg-gray-100 w-5/6" />
                <div className="h-2 rounded bg-gray-100 w-3/4" />
              </div>

              <p className="text-sm text-gray-500 mt-7">{doctor.description}</p>
            </div>

            <div className="p-6 sm:p-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-5">Select a Date & Time</h4>

              <div className="grid xl:grid-cols-[1fr_220px] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      onClick={() => {
                        const prev = new Date(calendarMonth);
                        prev.setMonth(prev.getMonth() - 1);
                        setCalendarMonth(prev);
                      }}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <select
                        value={calendarMonth.getMonth()}
                        onChange={(e) => {
                          const next = new Date(calendarMonth);
                          next.setMonth(Number(e.target.value));
                          setCalendarMonth(new Date(next.getFullYear(), next.getMonth(), 1));
                        }}
                        className="border border-gray-200 bg-white rounded-md px-2 py-1 text-xs font-medium text-gray-500"
                      >
                        {MONTH_NAMES.map((m, idx) => (
                          <option key={m} value={idx}>{m}</option>
                        ))}
                      </select>

                      <select
                        value={calendarMonth.getFullYear()}
                        onChange={(e) => {
                          const next = new Date(calendarMonth);
                          next.setFullYear(Number(e.target.value));
                          setCalendarMonth(new Date(next.getFullYear(), next.getMonth(), 1));
                        }}
                        className="border border-gray-200 bg-white rounded-md px-2 py-1 text-xs font-medium text-gray-500"
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        const next = new Date(calendarMonth);
                        next.setMonth(next.getMonth() + 1);
                        setCalendarMonth(next);
                      }}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {WEEK_DAYS.map((d) => (
                      <div key={d} className="text-[11px] text-center font-semibold text-gray-400 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell) => (
                      <button
                        key={cell.iso}
                        onClick={() => {
                          if (!cell.isBookable) return;
                          setSelectedDate(cell.iso);
                          setSelectedSlot(null);
                        }}
                        disabled={!cell.isBookable}
                        className={`h-10 rounded-full text-xs font-semibold transition ${
                          !cell.inMonth
                            ? "text-gray-300 cursor-not-allowed"
                            : cell.isBookable
                              ? selectedDate === cell.iso
                                ? "bg-[#0b57d0] text-white"
                                : "border border-gray-200 text-gray-700 hover:border-[#0b57d0]"
                              : "text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {cell.dayNumber}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">Local timezone: Asia/Kolkata</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    {selectedDate ? formatDateLong(selectedDate) : "Pick a date"}
                  </p>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {slots.length === 0 && (
                      <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-3">
                        No slots available for selected date.
                      </div>
                    )}

                    {slots.map((slot) => (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full py-2.5 rounded-lg border text-sm font-semibold transition ${
                          selectedSlot?.start === slot.start
                            ? "border-[#0b57d0] text-[#0b57d0] bg-blue-50"
                            : "border-gray-200 text-gray-700 hover:border-[#0b57d0]"
                        }`}
                      >
                        {formatTime12(slot.start)} - {formatTime12(slot.end)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onConfirm(doctor, selectedDate, selectedSlot)}
                    disabled={!selectedDate || !selectedSlot}
                    className="mt-4 w-full py-2.5 rounded-lg bg-[#0b57d0] hover:bg-[#0a49ad] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserDashboard() {
  const [allBookings, setAllBookings] = useState(FAKE_BOOKINGS);
  const [filter, setFilter] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [flashMessage, setFlashMessage] = useState("");

  const handleCancel = (id) =>
    setAllBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));

  const handleDelete = (id) => {
    setAllBookings((prev) => prev.filter((b) => b.id !== id));
    setFlashMessage("Event deleted successfully.");
    setTimeout(() => setFlashMessage(""), 2400);
  };

  const handleConfirmDoctorBooking = (doctor, date, slot) => {
    if (!date || !slot?.start || !slot?.end) return;

    const newBooking = {
      id: `new-${Date.now()}`,
      eventName: doctor.eventName,
      eventColor: doctor.eventColor,
      invitee: "You",
      inviteeEmail: "you@example.com",
      date,
      start_time: slot.start,
      end_time: slot.end,
      duration: doctor.duration,
      location: doctor.location,
      locationType: "video",
      meetingLink: `https://meet.example.com/${doctor.id}-${Date.now()}`,
      status: "active",
      notes: `${doctor.doctorName} (${doctor.specialty}) appointment booked from dashboard.`,
    };

    setAllBookings((prev) => [newBooking, ...prev]);
    setSelectedDoctor(null);
    setFlashMessage(`Booked with ${doctor.doctorName} on ${formatDateShort(date)} at ${formatTime12(slot.start)}`);
    setTimeout(() => setFlashMessage(""), 2400);
  };

  const filtered = allBookings.filter((b) => {
    if (filter === "upcoming") return b.date >= TODAY && b.status !== "cancelled";
    if (filter === "past")     return b.date < TODAY  || b.status === "cancelled";
    return true;
  });

  const upcomingCount = allBookings.filter((b) => b.date >= TODAY && b.status !== "cancelled").length;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* â”€â”€ Page title â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            {upcomingCount} upcoming event{upcomingCount !== 1 ? "s" : ""}
          </p>
          {flashMessage && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 inline-block">
              {flashMessage}
            </p>
          )}
        </div>

        {/* â”€â”€ Bookings list card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">

          {/* Tab bar */}
          <div className="flex border-b border-gray-100 px-4 pt-4 gap-1">
            {[
              { key: "upcoming", label: "Upcoming" },
              { key: "past",     label: "Past"     },
              { key: "all",      label: "All"       },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  filter === key
                    ? "text-[#0069ff] border-b-2 border-[#0069ff] bg-white -mb-px"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                No {filter === "upcoming" ? "upcoming" : filter === "past" ? "past" : ""} events
              </p>
              <p className="text-xs text-gray-400">
                {filter === "upcoming"
                  ? "Share your booking link to get your first meeting."
                  : "Completed and cancelled meetings will appear here."}
              </p>
            </div>
          ) : (
            filtered.map((b) => (
              <BookingRow key={b.id} booking={b} onClick={() => setSelectedBooking(b)} />
            ))
          )}
        </div>

        {/* Doctor booking cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Book a Doctor</h2>
            <p className="text-xs text-gray-500">4 sample doctors, available 5 days per week</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {DOCTOR_BOOKING_TYPES.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <div className="h-1" style={{ background: doctor.eventColor }} />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{doctor.specialty}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1">{doctor.doctorName}</h3>
                  <p className="text-sm text-gray-700 mt-0.5">{doctor.eventName}</p>

                  <div className="flex items-center gap-3 mt-3 mb-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> {doctor.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" /> Mon - Fri
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Video className="w-3 h-3" /> {doctor.location}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">{doctor.description}</p>

                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full py-2 border border-[#0069ff] text-[#0069ff] hover:bg-blue-50 rounded-lg text-sm font-medium transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DetailDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      <BookingPickerModal
        key={selectedDoctor?.id || "none"}
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onConfirm={handleConfirmDoctorBooking}
      />
    </div>
  );
}

export default UserDashboard;
