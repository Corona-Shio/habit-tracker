import { getMonthMatrix, toDateKey } from "../lib/date";

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

export default function MonthCalendar({ habit, cursorDate, getStatus, getFillTick, onToggleStatus }) {
  if (!habit) {
    return <p className="empty-message">月表示する習慣を選択してください。</p>;
  }

  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();
  const matrix = getMonthMatrix(year, month);

  return (
    <div className="month-calendar">
      <div className="month-title-wrap">
        <h3>
          {year}年 {month + 1}月
        </h3>
        <p>{habit.name}</p>
      </div>

      <table>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label, index) => (
              <th key={label} className={`day-${index}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date) => {
                const dateKey = toDateKey(date);
                const status = getStatus(habit.id, dateKey);
                const cellKey = `${habit.id}:${dateKey}`;
                const fillTick = getFillTick(cellKey);
                const fillClass =
                  fillTick > 0 && status !== 0 ? (fillTick % 2 === 0 ? "fill-wave-b" : "fill-wave-a") : "";
                const isCurrentMonth = date.getMonth() === month;
                return (
                  <td key={dateKey} className={isCurrentMonth ? "" : "outside-month"}>
                    <button
                      type="button"
                      className={`calendar-cell ${statusClass(status)} ${fillClass}`.trim()}
                      onClick={() => onToggleStatus(habit.id, dateKey)}
                      aria-label={`${habit.name} ${dateKey} の達成状態`}
                    >
                      <span className="calendar-date">{date.getDate()}</span>
                      <span className="calendar-state" aria-hidden="true" />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
