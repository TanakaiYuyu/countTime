interface BackgroundTypeSelectorProps {
  backgroundType: 'default' | 'solid' | 'media';
  onBackgroundTypeChange: (value: 'default' | 'solid' | 'media') => void;
}

export default function BackgroundTypeSelector({ backgroundType, onBackgroundTypeChange }: BackgroundTypeSelectorProps) {
  return (
    <div className="field">
      <label className="field__label">Background</label>
      <div className="flex flex-col gap-3">
        {[
          { value: 'default', label: 'Default Theme Background' },
          { value: 'solid', label: 'Solid Color' },
          { value: 'media', label: 'Image / Video' },
        ].map((bg) => (
          <label
            key={bg.value}
            className="flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all"
            style={{
              borderColor: backgroundType === bg.value ? 'var(--color-accent)' : 'var(--color-border)',
              backgroundColor: backgroundType === bg.value ? 'var(--color-surface-raised)' : 'transparent',
            }}
          >
            <input
              type="radio"
              name="backgroundType"
              value={bg.value}
              checked={backgroundType === bg.value}
              onChange={(e) => onBackgroundTypeChange(e.target.value as 'default' | 'solid' | 'media')}
            />
            <span style={{ color: 'var(--color-text)' }}>{bg.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

