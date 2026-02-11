import { useEffect, useMemo, useState } from "react";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import HabitEditorDialog from "./components/HabitEditorDialog";
import HabitManagerDialog from "./components/HabitManagerDialog";
import { useLocalStorageStore } from "./hooks/useLocalStorageStore";
import {
  addDays,
  formatDateRange,
  getDateRangeKeys,
  getWeekDates,
  startOfSundayWeek,
  toDateKey
} from "./utils/date";
import { calculateHabitProgress } from "./utils/progress";

export default function App() {
  const { state, saveError, activeHabits, archivedHabits, actions } = useLocalStorageStore();

  const [view, setView] = useState("week");
  const [weekCursor, setWeekCursor] = useState(new Date());
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [isManagerOpen, setManagerOpen] = useState(false);
  const [editorState, setEditorState] = useState({
    open: false,
    mode: "add",
    habit: null
  });
  const [selectedMonthHabitId, setSelectedMonthHabitId] = useState(null);

  useEffect(() => {
    if (activeHabits.length === 0) {
      setSelectedMonthHabitId(null);
      return;
    }

    const exists = activeHabits.some((habit) => habit.id === selectedMonthHabitId);
    if (!exists) {
      setSelectedMonthHabitId(activeHabits[0].id);
    }
  }, [activeHabits, selectedMonthHabitId]);

  const weekDates = useMemo(() => getWeekDates(weekCursor), [weekCursor]);

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const weekProgressRange = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    const isCurrentWeek = startOfSundayWeek(todayOnly).getTime() === start.getTime();
    const rangeEnd = isCurrentWeek ? todayOnly : end;
    return {
      start,
      end: rangeEnd,
      label: formatDateRange(start, rangeEnd),
      title: isCurrentWeek ? "今週の達成度" : "表示中週の達成度"
    };
  }, [weekDates, todayOnly]);

  const monthProgressRange = useMemo(() => {
    const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const end = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
    const isCurrentMonth =
      monthCursor.getFullYear() === todayOnly.getFullYear() && monthCursor.getMonth() === todayOnly.getMonth();
    const rangeEnd = isCurrentMonth ? todayOnly : end;
    return {
      start,
      end: rangeEnd,
      label: formatDateRange(start, rangeEnd),
      title: isCurrentMonth ? "今月の達成度" : "表示中月の達成度"
    };
  }, [monthCursor, todayOnly]);

  const activeProgressRange = view === "week" ? weekProgressRange : monthProgressRange;
  const activeRangeKeys = useMemo(
    () => getDateRangeKeys(activeProgressRange.start, activeProgressRange.end),
    [activeProgressRange]
  );

  const habitProgressById = useMemo(() => {
    const map = {};
    for (const habit of activeHabits) {
      map[habit.id] = calculateHabitProgress(state.records, habit.id, activeRangeKeys);
    }
    return map;
  }, [activeHabits, state.records, activeRangeKeys]);

  function openAddDialog() {
    setEditorState({ open: true, mode: "add", habit: null });
  }

  function openEditDialog(habit) {
    setEditorState({ open: true, mode: "edit", habit });
  }

  function closeEditorDialog() {
    setEditorState((prev) => ({ ...prev, open: false }));
  }

  function handleSaveHabit({ name, color }) {
    if (editorState.mode === "edit" && editorState.habit) {
      actions.updateHabit(editorState.habit.id, { name, color });
    } else {
      actions.addHabit(name, color);
    }
    closeEditorDialog();
  }

  function handleDeleteHabit(habitId) {
    actions.deleteHabit(habitId);
  }

  return (
    <div className="app-shell" data-skip-style="cross-bold">
      <header className="app-header">
        <div>
          <h1>Habit Tracker</h1>
          <p>週と月で達成を記録するシンプルな習慣トラッカー</p>
        </div>

        <div className="header-controls">
          <div className="segmented" role="tablist" aria-label="ビュー切替">
            <button type="button" className={view === "week" ? "active" : ""} onClick={() => setView("week")}>
              週
            </button>
            <button type="button" className={view === "month" ? "active" : ""} onClick={() => setView("month")}>
              月
            </button>
          </div>

          <button type="button" onClick={() => setManagerOpen(true)}>
            習慣管理
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="main-column">
          {view === "week" ? (
            <>
              <div className="range-toolbar">
                <div className="range-actions">
                  <button type="button" onClick={() => setWeekCursor((prev) => addDays(prev, -7))}>
                    前週
                  </button>
                  <button type="button" onClick={() => setWeekCursor((prev) => addDays(prev, 7))}>
                    次週
                  </button>
                  <button type="button" onClick={() => setWeekCursor(new Date())}>
                    今週
                  </button>
                </div>
              </div>

              <WeekView
                weekDates={weekDates}
                activeHabits={activeHabits}
                records={state.records}
                onToggleStatus={actions.cycleHabitStatus}
              />
            </>
          ) : (
            <>
              <div className="range-toolbar">
                <div className="range-actions">
                  <button type="button" onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                    前月
                  </button>
                  <button type="button" onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                    次月
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = new Date();
                      setMonthCursor(new Date(current.getFullYear(), current.getMonth(), 1));
                    }}
                  >
                    今月
                  </button>
                </div>
              </div>

              <MonthView
                monthCursor={monthCursor}
                activeHabits={activeHabits}
                selectedHabitId={selectedMonthHabitId}
                onSelectHabit={setSelectedMonthHabitId}
                records={state.records}
                onToggleStatus={actions.cycleHabitStatus}
              />
            </>
          )}
        </section>

        <section className="summary-panel" aria-label="達成度サマリー">
          <h2>
            習慣ごとの達成度（{activeProgressRange.title} / {activeProgressRange.label}）
          </h2>
          <p className="help-text">スキップは分母から除外して計算しています。</p>
          {activeHabits.length === 0 ? (
            <p className="empty-state">習慣を追加すると集計が表示されます。</p>
          ) : (
            <div className="summary-list">
              {activeHabits.map((habit) => {
                const progress = habitProgressById[habit.id] ?? { numerator: 0, denominator: 0, percent: 0 };
                return (
                  <article key={habit.id} className="summary-item">
                    <div className="summary-item-head">
                      <div className="habit-title-wrap">
                        <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
                        <strong>{habit.name}</strong>
                      </div>
                      <span>{progress.percent}%</span>
                    </div>
                    <div className="linear-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
                      <div className="linear-progress-fill" style={{ width: `${progress.percent}%`, backgroundColor: habit.color }} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>{saveError ? "ローカル保存に失敗しました" : "変更は localStorage に保存されます"}</span>
        <span>今日: {toDateKey(today)}</span>
      </footer>

      <HabitManagerDialog
        open={isManagerOpen}
        onClose={() => setManagerOpen(false)}
        activeHabits={activeHabits}
        archivedHabits={archivedHabits}
        onRequestAdd={openAddDialog}
        onRequestEdit={openEditDialog}
        onArchive={actions.archiveHabit}
        onRestore={actions.restoreHabit}
        onDelete={handleDeleteHabit}
      />

      <HabitEditorDialog
        open={editorState.open}
        mode={editorState.mode}
        initialHabit={editorState.habit}
        onSave={handleSaveHabit}
        onClose={closeEditorDialog}
      />
    </div>
  );
}
