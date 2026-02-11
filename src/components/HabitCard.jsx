import StatusCell from "./StatusCell";
import { STATUS } from "../constants/status";
import { toDateKey } from "../utils/date";

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function HabitCard({ habit, weekDates, records, progress, onToggleStatus }) {
  return (
    <article className="habit-card">
      <div className="habit-card-header">
        <div className="habit-title-wrap">
          <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
          <h3>{habit.name}</h3>
        </div>
        <div className="habit-progress-meta">
          <strong>{progress.percent}%</strong>
          <span>
            {formatScore(progress.numerator)} / {progress.denominator}
          </span>
        </div>
      </div>

      <div className="linear-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
        <div className="linear-progress-fill" style={{ width: `${progress.percent}%`, backgroundColor: habit.color }} />
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
