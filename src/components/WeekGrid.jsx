import { toDateKey } from "../lib/date";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function statusClass(status) {
  if (status === 1) {
    return "status-done";
  }
  if (status === 0.5) {
    return "status-partial";
  }
  return "status-empty";
}

export default function WeekGrid({
  habits,
  weekDates,
  selectedHabitId,
  onSelectHabit,
  getStatus,
  getFillTick,
  onToggleStatus
}) {
  if (habits.length === 0) {
    return <p className="empty-message">週表示する習慣がありません。</p>;
  }

  return (
    <section className="week-board" aria-label="週間トラッキングボード">
      <div className="week-day-strip" aria-hidden="true">
        {weekDates.map((date) => {
          const day = date.getDay();
          const dateKey = toDateKey(date);
          return (
            <div key={`head-${dateKey}`} className="week-day-chip">
              <span className={`weekday-badge day-${day}`}>{WEEKDAY_LABELS[day]}</span>
              <span className="date-label">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="habit-box-grid">
        {habits.map((habit) => {
          const isSelected = habit.id === selectedHabitId;
          return (
            <article key={habit.id} className={`habit-box ${isSelected ? "selected" : ""}`}>
              <button className="habit-box-name" type="button" onClick={() => onSelectHabit(habit.id)}>
                {habit.name}
              </button>

              <div className="habit-box-cells">
                {weekDates.map((date) => {
                  const dateKey = toDateKey(date);
                  const status = getStatus(habit.id, dateKey);
                  const cellKey = `${habit.id}:${dateKey}`;
                  const fillTick = getFillTick(cellKey);
                  const fillClass =
                    fillTick > 0 && status !== 0 ? (fillTick % 2 === 0 ? "fill-wave-b" : "fill-wave-a") : "";

                  return (
                    <button
                      key={`${habit.id}-${dateKey}`}
                      type="button"
                      className={`status-cell ${statusClass(status)} ${fillClass}`.trim()}
                      onClick={() => onToggleStatus(habit.id, dateKey)}
                      aria-label={`${habit.name} ${dateKey} の達成状態`}
                    >
                      <span className="status-mark" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
