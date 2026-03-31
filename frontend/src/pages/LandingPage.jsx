import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Calendar, Clock3, Sparkles, ArrowRight, CheckCircle2, Stethoscope } from "lucide-react";

function LandingPage() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedSlot, setSelectedSlot] = useState("10:05am");

  const daySlots = useMemo(
    () => ({
      Mon: ["09:30am", "10:05am", "10:40am", "11:15am"],
      Tue: ["10:00am", "10:35am", "11:10am", "11:45am"],
      Wed: ["09:00am", "09:35am", "10:10am", "10:45am"],
      Thu: ["11:00am", "11:35am", "12:10pm", "12:45pm"],
      Fri: ["09:30am", "10:05am", "10:40am", "11:15am"],
    }),
    []
  );

  const activeSlots = daySlots[selectedDay] || [];

  return (
    <main className="relative min-h-[92vh] overflow-hidden bg-[#f6f8ff]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#0b57d0]/15 blur-3xl animate-pulse" />
        <div className="absolute top-24 right-10 h-80 w-80 rounded-full bg-[#14b8a6]/15 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 right-1/4 h-72 w-72 rounded-full bg-[#f97316]/12 blur-3xl animate-pulse" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0b57d0]/25 bg-white/85 px-4 py-2 text-xs font-semibold tracking-wider text-[#0b57d0] backdrop-blur [font-family:'Space_Grotesk',sans-serif]">
          <Sparkles className="h-3.5 w-3.5" />
          SMART SCHEDULING EXPERIENCE
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] text-[#101828] [font-family:'Space_Grotesk',sans-serif]">
              Meetings that book themselves, with style.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Build doctor, team, or client booking flows in minutes. Your users pick a date,
              choose buffered slots, and confirm instantly without back-and-forth messages.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/user-dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b57d0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b57d0]/30 transition hover:-translate-y-0.5 hover:bg-[#0a49ad]"
              >
                Start Booking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Open Creator Dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Avg. setup", value: "7 min" },
                { label: "No-show drop", value: "-32%" },
                { label: "Weekly saves", value: "5+ hrs" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-[#0b57d0] [font-family:'Space_Grotesk',sans-serif]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl shadow-[#1e3a8a]/10 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Live Preview</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 [font-family:'Space_Grotesk',sans-serif]">Doctor Consultation</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#f8faff] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Stethoscope className="h-4 w-4 text-[#0b57d0]" />
                Dr. Meera Kapoor · Dermatologist
              </div>

              <div className="mb-4 grid grid-cols-5 gap-2">
                {Object.keys(daySlots).map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedSlot(daySlots[day][1]);
                    }}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
                      selectedDay === day
                        ? "bg-[#0b57d0] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#0b57d0]/40"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                {activeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      selectedSlot === slot
                        ? "border-[#0b57d0] bg-[#e8f0ff] text-[#0b57d0]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#0b57d0]/40"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selectedDay}</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {selectedSlot}</span>
                <span>buffered slots</span>
              </div>
            </div>

            <Link
              to="/user-dashboard"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#101828] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Continue to User Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Patient-friendly flow",
              text: "Date first, slot second, instant confirmation with no confusion.",
            },
            {
              title: "Buffer-aware scheduling",
              text: "Prevent overlaps with automatic meeting + buffer slot logic.",
            },
            {
              title: "Role-based workspace",
              text: "Switch between User Dashboard and Creator Dashboard anytime.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 [font-family:'Space_Grotesk',sans-serif]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
