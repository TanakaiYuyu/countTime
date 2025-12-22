interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  // Ensure valid hex color, default to #F8B334 if invalid or empty
  const normalizedValue = value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#F8B334';
  
  const handleColorChange = (newValue: string) => {
    // Normalize to uppercase hex
    const normalized = newValue.toUpperCase();
    if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
      onChange(normalized);
    } else if (/^[0-9A-Fa-f]{6}$/.test(normalized)) {
      onChange(`#${normalized}`);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={normalizedValue}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{
            width: '4rem',
            height: 'var(--height-input)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          className="input flex-1"
          value={value || '#F8B334'}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#F8B334"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </div>
  );
}

