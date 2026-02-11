import { useMemo, useState } from "react";

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

export default function HabitManagerDialog({
  open,
  onClose,
  activeHabits,
  archivedHabits,
  onRequestAdd,
  onRequestEdit,
  onArchive,
  onRestore,
  onDelete
}) {
  const [tab, setTab] = useState("active");

  const list = useMemo(() => (tab === "active" ? activeHabits : archivedHabits), [tab, activeHabits, archivedHabits]);

  if (!open) {
    return null;
  }

  function handleDelete(habit) {
    const ok = window.confirm(`「${habit.name}」を削除しますか？この操作は取り消せません。`);
    if (ok) {
      onDelete(habit.id);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="habit-manager-title" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h3 id="habit-manager-title">習慣管理</h3>
          <button type="button" onClick={onClose} aria-label="閉じる">
            閉じる
          </button>
        </header>

        <div className="manager-toolbar">
          <div className="segmented" role="tablist" aria-label="習慣一覧切替">
            <button type="button" className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>
              アクティブ ({activeHabits.length})
            </button>
            <button type="button" className={tab === "archived" ? "active" : ""} onClick={() => setTab("archived")}>
              アーカイブ ({archivedHabits.length})
            </button>
          </div>
          <button type="button" onClick={onRequestAdd}>
            習慣を追加
          </button>
        </div>

        <div className="manager-list">
          {list.length === 0 ? (
            <p className="empty-state">表示する習慣がありません。</p>
          ) : (
            list.map((habit) => (
              <div key={habit.id} className="manager-row">
                <div className="manager-main">
                  <span className="habit-color-dot" style={{ backgroundColor: habit.color }} aria-hidden="true" />
                  <div>
                    <strong>{habit.name}</strong>
                    <p>作成日: {formatDate(habit.createdAt)}</p>
                  </div>
                </div>

                <div className="manager-actions">
                  <button type="button" className="text-button" onClick={() => onRequestEdit(habit)}>
                    編集
                  </button>
                  {tab === "active" ? (
                    <button type="button" className="text-button" onClick={() => onArchive(habit.id)}>
                      アーカイブ
                    </button>
                  ) : (
                    <button type="button" className="text-button" onClick={() => onRestore(habit.id)}>
                      復元
                    </button>
                  )}
                  <button type="button" className="danger-button" onClick={() => handleDelete(habit)}>
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
