import StatusCell from "./StatusCell";
import { STATUS } from "../constants/status";

const STATUS_OPTIONS = [
  { value: STATUS.NONE, label: "未達成" },
  { value: STATUS.HALF, label: "半分" },
  { value: STATUS.DONE, label: "達成" },
  { value: STATUS.SKIP, label: "スキップ" }
];

export default function DayDetailDialog({
  open,
  dateKey,
  activeHabits,
  records,
  onClose,
  onCycleStatus,
  onSetStatus
}) {
  if (!open || !dateKey) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="day-detail-title" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h3 id="day-detail-title">{dateKey} の記録</h3>
          <button type="button" onClick={onClose} aria-label="閉じる">
            閉じる
          </button>
        </header>

        <div className="modal-body">
          {activeHabits.length === 0 ? (
            <p className="empty-state">アクティブな習慣がありません。</p>
          ) : (
            activeHabits.map((habit) => {
              const status = records[habit.id]?.[dateKey] ?? STATUS.NONE;
              return (
                <div key={habit.id} className="day-detail-row">
                  <div>
                    <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
                    <strong>{habit.name}</strong>
                  </div>
                  <div className="day-detail-actions">
                    <StatusCell
                      status={status}
                      color={habit.color}
                      onClick={() => onCycleStatus(habit.id, dateKey)}
                      ariaLabel={`${habit.name} ${dateKey}`}
                    />
                    <div className="status-pills" role="radiogroup" aria-label={`${habit.name}の状態選択`}>
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={status === option.value ? "active" : ""}
                          onClick={() => onSetStatus(habit.id, dateKey, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
