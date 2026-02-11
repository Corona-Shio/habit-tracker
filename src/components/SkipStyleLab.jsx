const SKIP_STYLE_OPTIONS = [
  {
    id: "cross-thin",
    label: "細めバッテン",
    note: "最小限で軽い印象"
  },
  {
    id: "cross-medium",
    label: "標準バッテン",
    note: "視認性と軽さの中間"
  },
  {
    id: "cross-bold",
    label: "太めバッテン",
    note: "しっかり主張するX"
  },
  {
    id: "cross-double",
    label: "二重バッテン",
    note: "線を重ねて強調"
  },
  {
    id: "cross-outline",
    label: "マーカー風X",
    note: "外側を柔らかく強調"
  }
];

export default function SkipStyleLab({ value, onChange }) {
  return (
    <section className="skip-style-lab" aria-label="スキップデザイン比較">
      <div className="skip-style-lab-head">
        <h2>スキップデザイン比較</h2>
        <p>候補をタップすると、画面全体に即時反映されます。</p>
      </div>

      <div className="skip-style-grid">
        {SKIP_STYLE_OPTIONS.map((option) => {
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`skip-style-option ${isActive ? "active" : ""}`}
              onClick={() => onChange(option.id)}
              data-style={option.id}
            >
              <span className="skip-preview-cell" aria-hidden="true" />
              <strong>{option.label}</strong>
              <span>{option.note}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
