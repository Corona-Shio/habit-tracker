import HabitCard from "./HabitCard";
import { WEEKDAY_LABELS_SHORT, toDateKey } from "../utils/date";

export default function WeekView({
  weekDates,
  activeHabits,
  records,
  habitProgressById,
  overallProgress,
  displayedWeekLabel,
  progressTitle,
  progressRangeLabel,
  onToggleStatus
}) {
  return (
    <section className="view-panel" aria-label="週間ビュー">
      <div className="panel-header">
        <div>
          <h2>週間ビュー</h2>
          <p>{displayedWeekLabel}</p>
        </div>
        <div className="overall-progress-card">
          <span className="overall-label">{progressTitle}</span>
          <strong>{overallProgress.percent}%</strong>
          <span className="overall-sub">
            {progressRangeLabel} / スキップは集計対象外
          </span>
          <div
            className="linear-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overallProgress.percent}
          >
            <div className="linear-progress-fill" style={{ width: `${overallProgress.percent}%` }} />
          </div>
        </div>
      </div>

      <div className="week-head-row" aria-hidden="true">
        {weekDates.map((date) => {
          const day = date.getDay();
          return (
            <div key={toDateKey(date)} className="week-head-cell">
              <span className={`weekday day-${day}`}>{WEEKDAY_LABELS_SHORT[day]}</span>
              <span className="date">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="habit-card-list">
        {activeHabits.length === 0 ? (
          <p className="empty-state">習慣がありません。管理から追加してください。</p>
        ) : (
          activeHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              weekDates={weekDates}
              records={records}
              progress={habitProgressById[habit.id] ?? { numerator: 0, denominator: 0, percent: 0 }}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}
