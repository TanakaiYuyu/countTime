import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsInputFrame,
  SettingsLabel,
} from '@telemetryos/sdk/react';
import { useCountdownStore } from '../../hooks/useCountdownStore';
import { getAllTimezoneOptions } from '../../utils/timezones';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

export default function TargetEventCard() {
  const { targetDateTime, setTargetDateTime, timezone, setTimezone } = useCountdownStore();
  const tzDropdownRef = useRef<HTMLDivElement | null>(null);

  const dateValue = targetDateTime ? targetDateTime.split('T')[0] : '';
  const timeValue = targetDateTime ? targetDateTime.split('T')[1]?.substring(0, 5) : '';

  const timezones = useMemo(() => getAllTimezoneOptions(), []);

  const [isTzOpen, setIsTzOpen] = useState(false);
  const [tzSearch, setTzSearch] = useState('');

  const filteredTimezones = useMemo(() => {
    const term = tzSearch.toLowerCase().trim();
    if (!term) return timezones;
    return timezones.filter((tz) =>
      `${tz.label} ${tz.value} ${tz.offset}`.toLowerCase().includes(term)
    );
  }, [tzSearch, timezones]);

  const selectedTz = useMemo(
    () => timezones.find((tz) => tz.value === timezone),
    [timezones, timezone]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (tzDropdownRef.current && !tzDropdownRef.current.contains(e.target as Node)) {
        setIsTzOpen(false);
      }
    };
    if (isTzOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isTzOpen]);

  return (
    <SettingsBox>
      <SettingsHeading>Target Event</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Event Date</SettingsLabel>
        <SettingsInputFrame>
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
        </SettingsInputFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Event Time</SettingsLabel>
        <SettingsInputFrame>
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
        </SettingsInputFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Timezone</SettingsLabel>
        <SettingsInputFrame>
          <div
            ref={tzDropdownRef}
            className="timezone-picker-container h-full border"
          >
            <button
              type="button"
              onClick={() => setIsTzOpen((open) => !open)}
              className="w-full text-left h-full cursor-pointer"
              style={{
                minHeight: '3rem',
                width: '100%',
                background: 'transparent',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedTz
                  ? selectedTz.value === 'device'
                    ? `${selectedTz.label} (device)`
                    : `${selectedTz.offset} ${selectedTz.label}`
                  : 'Select a timezone'}
              </span>
              <span style={{ opacity: 0.7, fontSize: '0.875rem' }}>▼</span>
            </button>

            {isTzOpen && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 20,
                  top: '110%',
                  left: 0,
                  right: 0,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                  <input
                    type="text"
                    value={tzSearch}
                    onChange={(e) => setTzSearch(e.target.value)}
                    placeholder="Search city or offset (e.g., UTC, New York)"
                    autoFocus
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--color-text)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ maxHeight: '14rem', overflowY: 'auto' }}>
                  {filteredTimezones.map((tz) => {
                    const isActive = tz.value === timezone;
                    return (
                      <button
                        key={tz.value}
                        type="button"
                        onClick={() => {
                          setTimezone(tz.value);
                          setIsTzOpen(false);
                          setTzSearch('');
                        }}
                        className="w-full text-left"
                        style={{
                          padding: '0.6rem 0.75rem',
                          width: '100%',
                          border: 'none',
                          background: isActive ? 'var(--color-surface-raised)' : 'transparent',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tz.label}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          {tz.value === 'device' ? 'device' : tz.offset}
                        </span>
                      </button>
                    );
                  })}
                  {filteredTimezones.length === 0 && (
                    <div
                      style={{
                        padding: '0.6rem 0.75rem',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.9rem',
                      }}
                    >
                      No matches found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SettingsInputFrame>
      </SettingsField>
    </SettingsBox>
  );
}

