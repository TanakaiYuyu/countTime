interface BackgroundOpacitySliderProps {
  value: number; // 0-1
  onChange: (value: number) => void;
}

export default function BackgroundOpacitySlider({
  value,
  onChange,
}: BackgroundOpacitySliderProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className="field">
      <label className="field__label">Background Opacity</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          className="flex-1"
          style={{ accentColor: 'var(--color-accent)' }}
        />
        <span
          style={{
            color: 'var(--color-text)',
            minWidth: '3rem',
            textAlign: 'right',
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

