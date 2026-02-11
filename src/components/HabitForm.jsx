import { useState } from "react";

export default function HabitForm({ onAddHabit }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onAddHabit(trimmed);
    setName("");
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="section-head">
        <h2 className="form-title">新しい習慣を追加</h2>
        <p className="form-copy">短く具体的な名前にすると、毎日の記録が速くなります。</p>
      </div>
      <div className="habit-form-row">
        <input
          id="habit-name"
          type="text"
          placeholder="例: 読書 20分"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="習慣名"
        />
        <button type="submit">追加する</button>
      </div>
    </form>
  );
}
