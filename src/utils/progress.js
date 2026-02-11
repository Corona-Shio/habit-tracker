import { STATUS, STATUS_SCORE } from "../constants/status";

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateProgress(statusList) {
  let numerator = 0;
  let denominator = 0;

  for (const status of statusList) {
    if (status === STATUS.SKIP) {
      continue;
    }
    denominator += 1;
    numerator += STATUS_SCORE[status] ?? 0;
  }

  const percent = denominator === 0 ? 0 : clampPercent((numerator / denominator) * 100);

  return {
    numerator,
    denominator,
    percent
  };
}

export function collectHabitStatusesForDates(records, habitId, dateKeys) {
  const habitRecords = records[habitId] ?? {};
  return dateKeys.map((dateKey) => habitRecords[dateKey] ?? STATUS.NONE);
}

export function calculateHabitProgress(records, habitId, dateKeys) {
  const statuses = collectHabitStatusesForDates(records, habitId, dateKeys);
  return calculateProgress(statuses);
}

export function calculateOverallProgress(records, habitIds, dateKeys) {
  const statuses = [];
  for (const habitId of habitIds) {
    const habitStatuses = collectHabitStatusesForDates(records, habitId, dateKeys);
    statuses.push(...habitStatuses);
  }
  return calculateProgress(statuses);
}
