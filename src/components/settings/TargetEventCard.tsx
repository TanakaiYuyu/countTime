import { useMemo } from 'react';
import { useCountdownStore } from '../../hooks/useCountdownStore';
import { getAllTimezoneOptions } from '../../utils/timezones';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

export default function TargetEventCard() {
  const { targetDateTime, setTargetDateTime, timezone, setTimezone } = useCountdownStore();

  // Parse targetDateTime if it exists (format: "2025-12-31T23:59:00")
  const dateValue = targetDateTime ? targetDateTime.split('T')[0] : '';
  const timeValue = targetDateTime ? targetDateTime.split('T')[1]?.substring(0, 5) : '';

  // Get all timezone options
  const timezones = useMemo(() => getAllTimezoneOptions(), []);

  // Validate if the selected date/time is in the future
  const isValidDateTime = useMemo(() => {
    if (!targetDateTime) return true; // No date selected is valid
    
    const target = new Date(targetDateTime);
    const now = new Date();
    return target > now;
  }, [targetDateTime]);

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Target Event
          </h2>
        </div>
        <div className="p-4">
          <div className="field">
            <label className="field__label">Event Date</label>
            <DatePicker
              value={dateValue}
              onChange={(date) => {
                if (date && timeValue) {
                  setTargetDateTime(`${date}T${timeValue}:00`);
                } else if (date) {
                  setTargetDateTime(`${date}T00:00:00`);
                } else {
                  setTargetDateTime(null);
                }
              }}
            />
          </div>

          <div className="field">
            <label className="field__label">Event Time</label>
            <TimePicker
              value={timeValue}
              onChange={(time) => {
                if (time && dateValue) {
                  setTargetDateTime(`${dateValue}T${time}:00`);
                } else if (time) {
                  const today = new Date().toISOString().split('T')[0];
                  setTargetDateTime(`${today}T${time}:00`);
                }
              }}
            />
          </div>

          <div className="field">
            <label className="field__label">Timezone</label>
            <select
              className="select select--timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.value === 'device' 
                    ? tz.label
                    : `${tz.offset} ${tz.label}`
                  }
                </option>
              ))}
            </select>
          </div>

          {targetDateTime && !isValidDateTime && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-error)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <span>⚠️</span>
              <span>
                The selected date/time is in the past. The render page will show completion content immediately.
              </span>
            </div>
          )}

          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-4)' }}>
            Set a fixed target date and time for the countdown. The timer will count down to this exact moment.
            {targetDateTime && isValidDateTime && (
              <span
                style={{
                  display: 'block',
                  marginTop: 'var(--space-2)',
                  color: 'var(--color-success)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                ✓ Valid future date/time selected.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

