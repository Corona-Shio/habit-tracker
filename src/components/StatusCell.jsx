import { STATUS } from "../constants/status";

const STATUS_LABEL = {
  [STATUS.NONE]: "未達成",
  [STATUS.HALF]: "半分達成",
  [STATUS.DONE]: "達成",
  [STATUS.SKIP]: "スキップ"
};

export default function StatusCell({ status, onClick, color, ariaLabel }) {
  return (
    <button
      type="button"
      className={`status-cell status-${status}`}
      onClick={onClick}
      style={{ "--habit-color": color }}
      aria-label={`${ariaLabel}（${STATUS_LABEL[status]}）`}
      title={STATUS_LABEL[status]}
    >
      <span className="visually-hidden">{STATUS_LABEL[status]}</span>
    </button>
  );
}
