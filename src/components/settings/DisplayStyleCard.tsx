import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsHint,
  SettingsLabel,
  SettingsRadioFrame,
  SettingsRadioLabel,
} from '@telemetryos/sdk/react';
import { useCountdownStore } from '../../hooks/useCountdownStore';

export default function DisplayStyleCard() {
  const { displayStyle, setDisplayStyle } = useCountdownStore();

  const styles = [
    { value: 'digital' as const, label: 'Digital / LED', desc: 'Classic digital display with monospaced numbers' },
    { value: 'flip' as const, label: 'Flip Clock', desc: 'Animated flip-style card display' },
    { value: 'circular' as const, label: 'Circular Progress', desc: 'Circular ring with centered time value' },
    { value: 'blocks' as const, label: 'Block / Card Layout', desc: 'Separated blocks with distinct borders' },
  ];

  return (
    <SettingsBox>
      <SettingsHeading>Display Style</SettingsHeading>
      <SettingsField>
        <SettingsLabel>Visual Style</SettingsLabel>
        <SettingsRadioFrame>
          <div className="grid gap-2 w-full max-w-full">
            {styles.map((style) => (
              <label
                key={style.value}
                style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-2)',
                }}
              >
                <input
                  type="radio"
                  name="displayStyle"
                  value={style.value}
                  checked={displayStyle === style.value}
                  onChange={(e) => setDisplayStyle(e.target.value as typeof displayStyle)}
                  style={{ marginTop: '0.25rem' }}
                />
                <div>
                  <SettingsRadioLabel>{style.label}</SettingsRadioLabel>
                  <SettingsHint>{style.desc}</SettingsHint>
                </div>
              </label>
            ))}
          </div>
        </SettingsRadioFrame>
      </SettingsField>
    </SettingsBox>
  );
}

