/**
 * Time Units Card Component
 * 
 * Configure which time units to display and customize their labels.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';

const TIME_UNITS = [
  { key: 'days' as const, label: 'Days', icon: '📅' },
  { key: 'hours' as const, label: 'Hours', icon: '⏰' },
  { key: 'minutes' as const, label: 'Minutes', icon: '⏱️' },
  { key: 'seconds' as const, label: 'Seconds', icon: '⏲️' },
];

export default function TimeUnitsCard() {
  const { visibleUnits, setVisibleUnits } = useCountdownStoreContext();

  const toggleUnit = (unit: keyof typeof visibleUnits) => {
    setVisibleUnits({ ...visibleUnits, [unit]: !visibleUnits[unit] });
  };

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            ⏱️ Time Units
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {TIME_UNITS.map((unit) => (
            <div key={unit.key} className="time-unit-item" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'clamp(0.75rem, 0.875rem, 1rem)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              background: visibleUnits[unit.key] ? 'rgba(248, 179, 52, 0.05)' : 'transparent',
              transition: 'all var(--transition-base)',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                flex: 1,
              }}>
                <span>{unit.icon}</span>
                <span>{unit.label}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleUnit(unit.key)}
                className="toggle-switch"
                style={{
                  width: 'clamp(2.75rem, 2.875rem, 3rem)',
                  height: 'clamp(1.5rem, 1.625rem, 1.75rem)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: visibleUnits[unit.key] ? 'var(--color-accent)' : 'var(--color-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  touchAction: 'manipulation',
                }}
                aria-label={`Toggle ${unit.label}`}
                aria-pressed={visibleUnits[unit.key]}
              >
                <span style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: visibleUnits[unit.key] ? 'calc(100% - 1.375rem)' : '0.125rem',
                  width: 'clamp(1.25rem, 1.375rem, 1.5rem)',
                  height: 'clamp(1.25rem, 1.375rem, 1.5rem)',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'all var(--transition-base)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

