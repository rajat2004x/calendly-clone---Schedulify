// Timezone utility functions

export const getUserTimezone = () => {
  return localStorage.getItem("userTimezone") || "Asia/Kolkata";
};

export const getAvailabilitySettings = (eventId) => {
  const settings = localStorage.getItem(`availability-${eventId}`);
  return settings ? JSON.parse(settings) : null;
};

export const convertTimeToUserTimezone = (time, bookingTimezone, userTimezone) => {
  // Simple time offset calculation
  // In production, use a library like date-fns-tz or day.js with timezone plugin
  
  const date = new Date(`2026-01-01T${time}`);
  
  // This is a simplified version - in production use Intl.DateTimeFormat
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: userTimezone,
  });
};

export const getDayOfWeek = (dateStr) => {
  const date = new Date(dateStr);
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[date.getDay()];
};

export const isAvailableOnDay = (dateStr, availability) => {
  const dayOfWeek = getDayOfWeek(dateStr);
  const daySlot = availability?.availability?.find((s) => s.day === dayOfWeek);
  return daySlot?.enabled || true; // Default to available if no settings
};

export const getAvailableHours = (dateStr, availability) => {
  const dayOfWeek = getDayOfWeek(dateStr);
  const daySlot = availability?.availability?.find((s) => s.day === dayOfWeek);
  
  if (!daySlot?.enabled) {
    return null;
  }
  
  return {
    start: daySlot.startTime,
    end: daySlot.endTime,
  };
};

export const filterSlotsByAvailability = (slots, dateStr, availability) => {
  if (!availability) return slots;
  
  const availableHours = getAvailableHours(dateStr, availability);
  if (!availableHours) return [];
  
  return slots.filter((slot) => {
    const slotStart = slot.start;
    const slotEnd = slot.end;
    
    return (
      slotStart >= availableHours.start &&
      slotEnd <= availableHours.end
    );
  });
};
