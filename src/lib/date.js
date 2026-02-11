export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekStartSunday(baseDate) {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return start;
}

export function getWeekDates(baseDate) {
  const start = getWeekStartSunday(baseDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function getMonthMatrix(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const start = getWeekStartSunday(firstOfMonth);

  return Array.from({ length: 6 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
      return date;
    });
  });
}
