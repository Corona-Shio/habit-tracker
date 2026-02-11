import HabitCard from "./HabitCard";
import { WEEKDAY_LABELS_SHORT, toDateKey } from "../utils/date";

function getWeekPeriodLabels(weekDates) {
  const start = weekDates[0];
  const end = weekDates[6];
  const startYear = `${start.getFullYear()}年`;
  const endYear = `${end.getFullYear()}年`;
  const startMonth = `${String(start.getMonth() + 1).padStart(2, "0")}月`;
  const endMonth = `${String(end.getMonth() + 1).padStart(2, "0")}月`;

  return {
    year: startYear === endYear ? startYear : `${startYear} - ${endYear}`,
    month: startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
  };
}

export default function WeekView({
  weekDates,
  activeHabits,
  records,
  onToggleStatus
}) {
  const periodLabels = getWeekPeriodLabels(weekDates);

  return (
    <section className="view-panel" aria-label="週間ビュー">
      <div className="period-label-stack" aria-label="表示中の年月">
        <span className="period-year">{periodLabels.year}</span>
        <span className="period-month">{periodLabels.month}</span>
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
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}
