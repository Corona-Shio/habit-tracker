export default function HabitList({ habits, selectedHabitId, onSelectHabit, onArchiveHabit }) {
  if (habits.length === 0) {
    return <p className="empty-message">習慣を追加するとここに表示されます。</p>;
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => {
        const isSelected = habit.id === selectedHabitId;

        return (
          <li key={habit.id} className={isSelected ? "selected" : ""}>
            <button className="habit-select" type="button" onClick={() => onSelectHabit(habit.id)}>
              <span className="habit-name">{habit.name}</span>
              <span className="habit-sub">タップで表示対象に設定</span>
            </button>
            <button
              className="archive-button"
              type="button"
              onClick={() => onArchiveHabit(habit.id)}
              aria-label={`${habit.name}をアーカイブ`}
            >
              アーカイブ
            </button>
          </li>
        );
      })}
    </ul>
  );
}
