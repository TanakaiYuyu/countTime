import { useCountdownStore } from '../../hooks/useCountdownStore';

type UnitKey = 'days' | 'hours' | 'minutes' | 'seconds';

export default function TimeUnitsCard() {
  const { visibleUnits, setVisibleUnits, unitLabels, setUnitLabels } = useCountdownStore();

  const units: { key: UnitKey; label: string }[] = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'seconds', label: 'Seconds' },
  ];

  const handleUnitToggle = (key: UnitKey) => {
    setVisibleUnits({
      ...visibleUnits,
      [key]: !visibleUnits[key],
    });
  };

  const handleLabelChange = (key: UnitKey, value: string) => {
    setUnitLabels({
      ...unitLabels,
      [key]: value,
    });
  };

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Time Units
          </h2>
        </div>
        <div className="p-4">
          <div className="field">
            <label className="field__label">Visible Units</label>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-width) solid var(--color-border)',
              }}
            >
              {units.map((unit) => (
                <label
                  key={unit.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    cursor: 'pointer',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleUnits[unit.key]}
                    onChange={() => handleUnitToggle(unit.key)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      color: 'var(--color-text)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: visibleUnits[unit.key] ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                    }}
                  >
                    {unit.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-6)',
            }}
          >
            {units.map((unit) => (
              <div key={unit.key} className="field">
                <label className="field__label">{unit.label} Label</label>
                <input
                  type="text"
                  className="input"
                  value={unitLabels[unit.key]}
                  onChange={(e) => handleLabelChange(unit.key, e.target.value)}
                  placeholder={`e.g., ${unit.label.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

