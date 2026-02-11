import { useEffect, useState } from "react";

const DEFAULT_COLOR = "#1976d2";

export default function HabitEditorDialog({ open, mode, initialHabit, onSave, onClose }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialHabit?.name ?? "");
    setColor(initialHabit?.color ?? DEFAULT_COLOR);
  }, [open, initialHabit]);

  if (!open) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onSave({ name: trimmed, color });
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal small" role="dialog" aria-modal="true" aria-labelledby="habit-editor-title" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h3 id="habit-editor-title">{mode === "edit" ? "習慣を編集" : "習慣を追加"}</h3>
          <button type="button" onClick={onClose} aria-label="閉じる">
            閉じる
          </button>
        </header>

        <form className="editor-form" onSubmit={handleSubmit}>
          <label>
            習慣名
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例: 英単語を15分"
              maxLength={40}
              required
            />
          </label>

          <label>
            色
            <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          </label>

          <div className="dialog-actions">
            <button type="button" className="text-button" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit">保存</button>
          </div>
        </form>
      </section>
    </div>
  );
}
