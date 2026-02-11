import { STATUS } from "../constants/status";
import { WEEKDAY_LABELS_SHORT, formatMonthLabel, getMonthGrid, toDateKey } from "../utils/date";

export default function MonthView({
  monthCursor,
  activeHabits,
  selectedHabitId,
  onSelectHabit,
  records,
  onMoveMonth,
  onResetMonth,
  onToggleStatus,
  selectedHabitProgress,
  progressRangeLabel
}) {
  const monthLabel = formatMonthLabel(monthCursor);
  const grid = getMonthGrid(monthCursor);
  const currentMonth = monthCursor.getMonth();
  const selectedHabit = activeHabits.find((habit) => habit.id === selectedHabitId) ?? null;

  return (
    <section className="view-panel" aria-label="月間ビュー">
      <div className="panel-header month-header">
        <div>
          <h2>月間ビュー</h2>
          <p>習慣を選んで、日付ごとに状態を記録</p>
        </div>
        <div className="month-nav">
          <button type="button" onClick={() => onMoveMonth(-1)}>
            前月
          </button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={() => onMoveMonth(1)}>
            次月
          </button>
          <button type="button" onClick={onResetMonth}>
            今月
          </button>
        </div>
      </div>

      {activeHabits.length === 0 ? <p className="empty-state">習慣がありません。管理から追加してください。</p> : null}

      {activeHabits.length > 0 ? (
        <div className="month-habit-selector" role="tablist" aria-label="月表示の習慣選択">
          {activeHabits.map((habit) => (
            <button
              key={habit.id}
              type="button"
              className={habit.id === selectedHabit?.id ? "active" : ""}
              onClick={() => onSelectHabit(habit.id)}
            >
              <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
              {habit.name}
            </button>
          ))}
        </div>
      ) : null}

      {selectedHabit ? (
        <div className="month-selected-summary">
          <div className="habit-title-wrap">
            <span className="habit-color-dot" style={{ backgroundColor: selectedHabit.color }} aria-hidden="true" />
            <strong>{selectedHabit.name}</strong>
          </div>
          <span>
            達成度: {selectedHabitProgress.percent}% ({progressRangeLabel})
          </span>
        </div>
      ) : null}

      <div className="calendar-wrap">
        <div className="calendar-week-head" aria-hidden="true">
          {WEEKDAY_LABELS_SHORT.map((label, index) => (
            <div key={label} className={`calendar-weekday day-${index}`}>
              {label}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {grid.flat().map((date) => {
            const dateKey = toDateKey(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const status = selectedHabit ? records[selectedHabit.id]?.[dateKey] ?? STATUS.NONE : STATUS.NONE;

            return (
              <button
                key={dateKey}
                type="button"
                className={`calendar-day status-${status} ${isCurrentMonth ? "" : "outside"}`.trim()}
                onClick={() => selectedHabit && onToggleStatus(selectedHabit.id, dateKey)}
                aria-label={selectedHabit ? `${selectedHabit.name} ${dateKey} の状態を変更` : `${dateKey}`}
                disabled={!selectedHabit}
                style={{ "--habit-color": selectedHabit?.color ?? "#8d9aa9" }}
              >
                <div className="calendar-day-top">
                  <span>{date.getDate()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="help-text">記録順: 未達成 → 半分達成 → 達成 → スキップ。スキップは集計対象外です。</p>
    </section>
  );
}
