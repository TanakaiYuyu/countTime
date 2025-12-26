/**
 * Completion Time Card Component
 * 
 * Configure how completion time is determined and displayed.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import type { CountdownStore } from '../../store/countdownStore';

const COMPLETION_MODES: Array<{
  value: CountdownStore['completionTimeMode'];
  label: string;
  description: string;
}> = [
  {
    value: 'calculated',
    label: 'Auto Calculate',
    description: 'Derive from countdown end time',
  },
  {
    value: 'provided',
    label: 'Manual Time',
    description: 'Specify exact completion time',
  },
  {
    value: 'preview',
    label: 'Preview Mode',
    description: 'Use current time for testing',
  },
];

export default function CompletionTimeCard() {
  const {
    completionTimeMode,
    setCompletionTimeMode,
    completionTimeValue,
    setCompletionTimeValue,
  } = useCountdownStoreContext();

  const handleTimeValueChange = (value: string) => {
    if (!value) {
      setCompletionTimeValue(null);
      return;
    }
    try {
      const date = new Date(value);
      setCompletionTimeValue(date.toISOString());
    } catch (error) {
      console.error('Invalid completion time:', error);
    }
  };

  const formattedCompletionTime = completionTimeValue
    ? new Date(completionTimeValue).toISOString().slice(0, 16)
    : '';

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            ⏰ Completion Time
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Mode Selector */}
          <div>
            <label className="field__label" style={{ marginBottom: 'var(--space-3)' }}>
              COMPLETION TIME MODE
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {COMPLETION_MODES.map((mode) => (
                <label
                  key={mode.value}
                  className="radio-option"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(0.5rem, 0.625rem, 0.75rem)',
                    padding: 'clamp(0.75rem, 0.875rem, 1rem)',
                    border: `${completionTimeMode === mode.value ? '2px' : '1px'} solid ${
                      completionTimeMode === mode.value ? 'var(--color-accent)' : 'var(--color-border)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                    background: completionTimeMode === mode.value
                      ? 'rgba(248, 179, 52, 0.05)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    touchAction: 'manipulation',
                    minHeight: 'clamp(3rem, 3.25rem, 3.5rem)',
                  }}
                >
                  <input
                    type="radio"
                    name="completion-mode"
                    value={mode.value}
                    checked={completionTimeMode === mode.value}
                    onChange={() => setCompletionTimeMode(mode.value)}
                    style={{
                      marginTop: '0.125rem',
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer',
                      width: 'clamp(1rem, 1.125rem, 1.25rem)',
                      height: 'clamp(1rem, 1.125rem, 1.25rem)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-1)',
                    }}>
                      {mode.label}
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                      color: 'var(--color-text-muted)',
                    }}>
                      {mode.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Manual Time Input (shown when mode is 'provided') */}
          {completionTimeMode === 'provided' && (
            <div className="field">
              <label className="field__label" htmlFor="completion-time-value">
                COMPLETION TIME
              </label>
              <input
                id="completion-time-value"
                type="datetime-local"
                className="input input--date"
                value={formattedCompletionTime}
                onChange={(e) => handleTimeValueChange(e.target.value)}
                style={{ fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)' }}
              />
              <p style={{
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-2)',
                marginBottom: 0,
              }}>
                Specify the exact time when completion content should appear
              </p>
            </div>
          )}

          {completionTimeMode === 'preview' && (
            <div style={{
              padding: 'var(--space-3)',
              background: 'rgba(248, 179, 52, 0.1)',
              border: '1px solid var(--color-accent)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
              color: 'var(--color-text)',
            }}>
              <strong>Preview Mode:</strong> Completion content will appear immediately for testing purposes.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

