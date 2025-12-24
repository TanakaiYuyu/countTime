import { useMemo } from 'react';
import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsHint,
  SettingsInputFrame,
  SettingsLabel,
  SettingsRadioFrame,
  SettingsRadioLabel,
  SettingsSelectFrame,
} from '@telemetryos/sdk/react';
import { useCountdownStore } from '../../hooks/useCountdownStore';

const completionModes: Array<{
  value: 'calculated' | 'provided' | 'preview';
  label: string;
  hint: string;
}> = [
  {
    value: 'calculated',
    label: 'Calculated',
    hint: 'Use the configured target event to derive a completion label.',
  },
  {
    value: 'provided',
    label: 'Provided',
    hint: 'Operator supplies an explicit completion time label.',
  },
  {
    value: 'preview',
    label: 'Preview',
    hint: 'Use a sandbox label for review without changing live logic.',
  },
];

export default function CompletionTimeCard() {
  const {
    targetDateTime,
    completionTimeMode,
    setCompletionTimeMode,
    completionTimeValue,
    setCompletionTimeValue,
  } = useCountdownStore();

  const calculatedLabel = useMemo(() => {
    if (!targetDateTime) return 'Set a target event to calculate';
    return new Date(targetDateTime).toLocaleString();
  }, [targetDateTime]);

  return (
    <SettingsBox>
      <SettingsHeading>Completion Time</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Method</SettingsLabel>
        <SettingsRadioFrame>
          <div style={{ display: 'grid', gap: '0.75rem' }} className='w-full'>
            {completionModes.map((mode) => (
              <label
                key={mode.value}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-2)',
                }}
              >
                <input
                  type="radio"
                  name="completionTimeMode"
                  value={mode.value}
                  checked={completionTimeMode === mode.value}
                  onChange={(e) =>
                    setCompletionTimeMode(e.target.value as typeof completionTimeMode)
                  }
                  style={{
                    marginTop: '0.3rem',
                  }}
                />
                <div>
                  <SettingsRadioLabel>{mode.label}</SettingsRadioLabel>
                  <SettingsHint>{mode.hint}</SettingsHint>
                </div>
              </label>
            ))}
          </div>
        </SettingsRadioFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>
          {completionTimeMode === 'calculated'
            ? 'Calculated from Target Event'
            : 'Completion Time Label'}
        </SettingsLabel>
        <SettingsInputFrame>
          {completionTimeMode === 'provided' || completionTimeMode === 'preview' ? (
            <input
              type="text"
              value={completionTimeValue ?? ''}
              onChange={(e) => setCompletionTimeValue(e.target.value)}
              placeholder="e.g., Finishes at 5:30 PM"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontSize: 'var(--font-size-base)',
                padding: '0.75rem 1rem',
                color: 'var(--color-text)',
              }}
            />
          ) : (
            <SettingsSelectFrame>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {calculatedLabel}
              </div>
            </SettingsSelectFrame>
          )}
        </SettingsInputFrame>
      </SettingsField>
    </SettingsBox>
  );
}


