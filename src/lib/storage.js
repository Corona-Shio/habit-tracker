const STORAGE_KEY = "habit-tracker.v1";

function createInitialState() {
  return {
    schemaVersion: 1,
    habits: [],
    entries: []
  };
}

function normalizeState(raw) {
  if (!raw || typeof raw !== "object") {
    return createInitialState();
  }

  const habits = Array.isArray(raw.habits)
    ? raw.habits
        .filter((habit) => habit && typeof habit.id === "string" && typeof habit.name === "string")
        .map((habit) => ({
          id: habit.id,
          name: habit.name,
          createdAt: typeof habit.createdAt === "string" ? habit.createdAt : new Date().toISOString(),
          archived: Boolean(habit.archived)
        }))
    : [];

  const entries = Array.isArray(raw.entries)
    ? raw.entries
        .filter(
          (entry) =>
            entry &&
            typeof entry.habitId === "string" &&
            typeof entry.date === "string" &&
            (entry.status === 0 || entry.status === 0.5 || entry.status === 1)
        )
        .map((entry) => ({
          habitId: entry.habitId,
          date: entry.date,
          status: entry.status,
          updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : new Date().toISOString()
        }))
    : [];

  return {
    schemaVersion: 1,
    habits,
    entries
  };
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (_error) {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (_error) {
    return false;
  }
}
