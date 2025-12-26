/**
 * Target Event Card Component
 * 
 * Configure the countdown target date/time and timezone.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import DateTimePickerCustom from './DateTimePickerCustom';
import TimezoneSelectorCustom from './TimezoneSelectorCustom';

export default function TargetEventCard() {
  const {
    targetDateTime,
    setTargetDateTime,
    timezone,
    setTimezone,
    completionDurationMs,
    setCompletionDurationMs,
  } = useCountdownStoreContext();

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            🗓️ Target Event
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Date & Time Picker */}
          <DateTimePickerCustom
            value={targetDateTime}
            onChange={setTargetDateTime}
            label="Target Date & Time"
            placeholder="Select countdown target"
            hint="Choose when your countdown should end"
          />

          {/* Timezone Selector */}
          <TimezoneSelectorCustom
            value={timezone}
            onChange={setTimezone}
            label="Timezone"
            hint="Select the timezone for your countdown"
          />

          {/* Completion Duration */}
          <div className="field">
            <label className="field__label" htmlFor="completion-duration">
              SHOW COMPLETION FOR (SECONDS)
            </label>
            <input
              id="completion-duration"
              type="number"
              className="input"
              min="0"
              step="1"
              value={completionDurationMs / 1000}
              onChange={(e) => setCompletionDurationMs(Math.max(0, parseFloat(e.target.value) || 0) * 1000)}
              placeholder="0 = Show indefinitely"
              style={{ fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)' }}
            />
            <p style={{
              fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-2)',
              marginBottom: 0,
            }}>
              How long to display completion content (0 = indefinite)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

