import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { STATUS, cycleStatus, normalizeStatus } from "../constants/status";
import { addDays, toDateKey } from "../utils/date";

const STORAGE_KEY = "habit-tracker.app";
const DATA_VERSION = 2;
const FALLBACK_COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#6a1b9a", "#00838f", "#ad1457"];

function createHabitId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function statusFromLegacy(value) {
  if (value === 1 || value === "1") {
    return STATUS.DONE;
  }
  if (value === 0.5 || value === "0.5") {
    return STATUS.HALF;
  }
  if (value === "skip") {
    return STATUS.SKIP;
  }
  return STATUS.NONE;
}

function normalizeHabit(habit, index) {
  const name = typeof habit?.name === "string" ? habit.name.trim() : "";
  return {
    id: typeof habit?.id === "string" && habit.id ? habit.id : createHabitId(),
    name: name || `習慣 ${index + 1}`,
    createdAt: typeof habit?.createdAt === "string" && habit.createdAt ? habit.createdAt : new Date().toISOString(),
    archived: Boolean(habit?.archived),
    color: typeof habit?.color === "string" && habit.color ? habit.color : FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  };
}

function normalizeRecords(records, habitIds) {
  const allowedHabitIds = new Set(habitIds);
  if (!records || typeof records !== "object") {
    return {};
  }

  const normalized = {};
  for (const [habitId, dateMap] of Object.entries(records)) {
    if (!allowedHabitIds.has(habitId) || !dateMap || typeof dateMap !== "object") {
      continue;
    }

    for (const [dateKey, rawStatus] of Object.entries(dateMap)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        continue;
      }

      let status = normalizeStatus(rawStatus);
      if (status === STATUS.NONE) {
        status = statusFromLegacy(rawStatus);
      }
      if (status === STATUS.NONE) {
        continue;
      }

      if (!normalized[habitId]) {
        normalized[habitId] = {};
      }
      normalized[habitId][dateKey] = status;
    }
  }

  return normalized;
}

function createSeedState() {
  const habits = [
    {
      id: createHabitId(),
      name: "朝のストレッチ",
      createdAt: new Date().toISOString(),
      archived: false,
      color: "#1976d2"
    },
    {
      id: createHabitId(),
      name: "読書 20分",
      createdAt: new Date().toISOString(),
      archived: false,
      color: "#2e7d32"
    },
    {
      id: createHabitId(),
      name: "水を2L飲む",
      createdAt: new Date().toISOString(),
      archived: false,
      color: "#ed6c02"
    }
  ];

  const today = new Date();
  const d0 = toDateKey(today);
  const d1 = toDateKey(addDays(today, -1));
  const d2 = toDateKey(addDays(today, -2));
  const d3 = toDateKey(addDays(today, -3));

  return {
    appDataVersion: DATA_VERSION,
    habits,
    records: {
      [habits[0].id]: {
        [d0]: STATUS.DONE,
        [d1]: STATUS.HALF,
        [d2]: STATUS.DONE
      },
      [habits[1].id]: {
        [d0]: STATUS.HALF,
        [d1]: STATUS.SKIP,
        [d3]: STATUS.DONE
      },
      [habits[2].id]: {
        [d0]: STATUS.SKIP,
        [d1]: STATUS.DONE,
        [d2]: STATUS.HALF
      }
    }
  };
}

function migrateLegacyV1(raw) {
  const habits = Array.isArray(raw?.habits) ? raw.habits.map(normalizeHabit) : [];
  const records = {};

  if (Array.isArray(raw?.entries)) {
    for (const entry of raw.entries) {
      if (!entry || typeof entry.habitId !== "string" || typeof entry.date !== "string") {
        continue;
      }

      const status = statusFromLegacy(entry.status);
      if (status === STATUS.NONE) {
        continue;
      }

      if (!records[entry.habitId]) {
        records[entry.habitId] = {};
      }
      records[entry.habitId][entry.date] = status;
    }
  }

  return {
    appDataVersion: DATA_VERSION,
    habits,
    records
  };
}

function migrate(raw) {
  if (raw && typeof raw === "object" && typeof raw.appDataVersion === "number") {
    if (raw.appDataVersion >= DATA_VERSION) {
      return raw;
    }

    return {
      ...raw,
      appDataVersion: DATA_VERSION
    };
  }

  if (raw && typeof raw === "object" && raw.schemaVersion === 1) {
    return migrateLegacyV1(raw);
  }

  return raw;
}

function normalizeState(raw) {
  if (!raw || typeof raw !== "object") {
    return createSeedState();
  }

  const habits = Array.isArray(raw.habits)
    ? raw.habits.map(normalizeHabit)
    : [];

  const records = normalizeRecords(raw.records, habits.map((habit) => habit.id));

  return {
    appDataVersion: DATA_VERSION,
    habits,
    records
  };
}

function loadInitialState() {
  if (typeof localStorage === "undefined") {
    return createSeedState();
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return createSeedState();
    }

    const raw = JSON.parse(serialized);
    const migrated = migrate(raw);
    return normalizeState(migrated);
  } catch (_error) {
    return createSeedState();
  }
}

function setStatus(records, habitId, dateKey, status) {
  const next = { ...records };
  const habitRecords = { ...(next[habitId] ?? {}) };

  if (status === STATUS.NONE) {
    delete habitRecords[dateKey];
  } else {
    habitRecords[dateKey] = status;
  }

  if (Object.keys(habitRecords).length === 0) {
    delete next[habitId];
  } else {
    next[habitId] = habitRecords;
  }

  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_HABIT": {
      return {
        ...state,
        habits: [...state.habits, action.payload]
      };
    }
    case "UPDATE_HABIT": {
      return {
        ...state,
        habits: state.habits.map((habit) => {
          if (habit.id !== action.payload.id) {
            return habit;
          }
          return { ...habit, ...action.payload.changes };
        })
      };
    }
    case "SET_ARCHIVED": {
      return {
        ...state,
        habits: state.habits.map((habit) => {
          if (habit.id !== action.payload.id) {
            return habit;
          }
          return { ...habit, archived: action.payload.archived };
        })
      };
    }
    case "DELETE_HABIT": {
      const nextRecords = { ...state.records };
      delete nextRecords[action.payload.id];

      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.payload.id),
        records: nextRecords
      };
    }
    case "SET_STATUS": {
      return {
        ...state,
        records: setStatus(state.records, action.payload.habitId, action.payload.dateKey, action.payload.status)
      };
    }
    case "CYCLE_STATUS": {
      const current = state.records[action.payload.habitId]?.[action.payload.dateKey] ?? STATUS.NONE;
      return {
        ...state,
        records: setStatus(state.records, action.payload.habitId, action.payload.dateKey, cycleStatus(current))
      };
    }
    default:
      return state;
  }
}

export function useLocalStorageStore() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveError(false);
    } catch (_error) {
      setSaveError(true);
    }
  }, [state]);

  const activeHabits = useMemo(() => state.habits.filter((habit) => !habit.archived), [state.habits]);
  const archivedHabits = useMemo(() => state.habits.filter((habit) => habit.archived), [state.habits]);

  const addHabit = useCallback((name, color) => {
    const habit = {
      id: createHabitId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      archived: false,
      color
    };
    dispatch({ type: "ADD_HABIT", payload: habit });
    return habit;
  }, []);

  const updateHabit = useCallback((id, changes) => {
    const normalizedChanges = {
      ...changes
    };

    if (typeof normalizedChanges.name === "string") {
      normalizedChanges.name = normalizedChanges.name.trim();
    }

    dispatch({ type: "UPDATE_HABIT", payload: { id, changes: normalizedChanges } });
  }, []);

  const archiveHabit = useCallback((id) => {
    dispatch({ type: "SET_ARCHIVED", payload: { id, archived: true } });
  }, []);

  const restoreHabit = useCallback((id) => {
    dispatch({ type: "SET_ARCHIVED", payload: { id, archived: false } });
  }, []);

  const deleteHabit = useCallback((id) => {
    dispatch({ type: "DELETE_HABIT", payload: { id } });
  }, []);

  const cycleHabitStatus = useCallback((habitId, dateKey) => {
    dispatch({ type: "CYCLE_STATUS", payload: { habitId, dateKey } });
  }, []);

  const setHabitStatus = useCallback((habitId, dateKey, status) => {
    dispatch({ type: "SET_STATUS", payload: { habitId, dateKey, status } });
  }, []);

  return {
    state,
    saveError,
    activeHabits,
    archivedHabits,
    actions: {
      addHabit,
      updateHabit,
      archiveHabit,
      restoreHabit,
      deleteHabit,
      cycleHabitStatus,
      setHabitStatus
    }
  };
}
