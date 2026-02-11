export const WEEKDAY_LABELS_SHORT = ["日", "月", "火", "水", "木", "金", "土"];

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfSundayWeek(baseDate) {
  const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  date.setDate(date.getDate() - date.getDay());
  return date;
}

export function getWeekDates(baseDate) {
  const start = startOfSundayWeek(baseDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function addDays(baseDate, diff) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + diff);
  return date;
}

export function getDateRangeKeys(startDate, endDate) {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (start > end) {
    return [];
  }

  const keys = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export function getMonthGrid(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const start = startOfSundayWeek(first);

  return Array.from({ length: 6 }, (_, rowIndex) => {
    return Array.from({ length: 7 }, (_, columnIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + rowIndex * 7 + columnIndex);
      return date;
    });
  });
}

export function formatDateRange(startDate, endDate) {
  const start = `${startDate.getFullYear()}/${String(startDate.getMonth() + 1).padStart(2, "0")}/${String(startDate.getDate()).padStart(2, "0")}`;
  const end = `${String(endDate.getMonth() + 1).padStart(2, "0")}/${String(endDate.getDate()).padStart(2, "0")}`;
  return `${start} - ${end}`;
}

export function formatMonthLabel(baseDate) {
  return `${baseDate.getFullYear()}年\u2009${String(baseDate.getMonth() + 1).padStart(2, "0")}月`;
}
