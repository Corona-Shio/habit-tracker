import StatusCell from "./StatusCell";
import { STATUS } from "../constants/status";
import { toDateKey } from "../utils/date";

export default function HabitCard({ habit, weekDates, records, onToggleStatus }) {
  return (
    <article className="habit-card">
      <div className="habit-title-wrap">
        <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
        <h3>{habit.name}</h3>
      </div>

      <div className="status-row" aria-label={`${habit.name} の週間ステータス`}>
        {weekDates.map((date) => {
          const dateKey = toDateKey(date);
          const status = records[habit.id]?.[dateKey] ?? STATUS.NONE;
          return (
            <StatusCell
              key={`${habit.id}-${dateKey}`}
              status={status}
              color={habit.color}
              onClick={() => onToggleStatus(habit.id, dateKey)}
              ariaLabel={`${habit.name} ${dateKey}`}
            />
          );
        })}
      </div>
    </article>
  );
}
