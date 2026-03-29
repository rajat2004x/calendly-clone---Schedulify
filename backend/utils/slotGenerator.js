function generateSlots(start, end, duration, bufferTime = 0) {
  const slots = [];

  let current = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);

  while (current < endTime) {
    const next = new Date(current.getTime() + duration * 60000);

    if (next <= endTime) {
      slots.push({
        start: current.toTimeString().slice(0, 5),
        end: next.toTimeString().slice(0, 5),
      });
    }

    // Add buffer time (gap after the meeting)
    current = new Date(next.getTime() + bufferTime * 60000);
  }

  return slots;
}

module.exports = generateSlots;