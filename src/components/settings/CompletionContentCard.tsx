import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsHint,
  SettingsLabel,
  SettingsRadioFrame,
  SettingsRadioLabel,
  SettingsTextAreaFrame,
} from '@telemetryos/sdk/react';
import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import TelemetryMediaPicker from './TelemetryMediaPicker';

export default function CompletionContentCard() {
  const {
    completionType,
    setCompletionType,
    completionRichText,
    setCompletionRichText,
    completionMediaId,
    setCompletionMediaId,
  } = useCountdownStoreContext();

  const types = [
    {
      value: 'richText' as const,
      label: 'Rich Text Message',
      desc: 'Show operator-provided copy when the countdown finishes.',
    },
    { value: 'media' as const, label: 'Image / Video', desc: 'Play selected TelemetryOS media.' },
    { value: 'none' as const, label: 'None', desc: 'Keep the timer on 00:00:00.' },
  ];

  return (
    <SettingsBox>
      <SettingsHeading>Completion Content</SettingsHeading>

      <SettingsField>
        <SettingsLabel>When Countdown Reaches Zero</SettingsLabel>
        <SettingsRadioFrame>
          <div className="grid gap-3 w-full">
            {types.map((type) => (
              <label
                key={type.value}
                className="cursor-pointer w-full"
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', border: 'var(--border-width) solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)' }}
              >
                <input
                  type="radio"
                  name="completionType"
                  value={type.value}
                  checked={completionType === type.value}
                  onChange={(e) => setCompletionType(e.target.value as typeof completionType)}
                  style={{ marginTop: '0.3rem' }}
                />
                <div>
                  <SettingsRadioLabel>{type.label}</SettingsRadioLabel>
                  <SettingsHint>{type.desc}</SettingsHint>
                </div>
              </label>
            ))}
          </div>
        </SettingsRadioFrame>
      </SettingsField>

      {completionType === 'richText' && (
        <SettingsField>
          <SettingsLabel>Completion Message</SettingsLabel>
          <SettingsTextAreaFrame>
            <textarea
              rows={3}
              value={completionRichText}
              onChange={(e) => setCompletionRichText(e.target.value)}
              placeholder="Enter completion message..."
              style={{
                width: '100%',
                background: 'transparent',
                padding: '0.75rem 1rem',
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text)',
                resize: 'vertical',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </SettingsTextAreaFrame>
        </SettingsField>
      )}

      {completionType === 'media' && (
        <SettingsField>
          <SettingsLabel>Completion Media</SettingsLabel>
          <TelemetryMediaPicker
            label="Media"
            value={completionMediaId}
            onChange={setCompletionMediaId}
            allowedTypes={['image', 'video']}
            hint="Media is loaded via TelemetryOS and rendered on the signage output."
          />
        </SettingsField>
      )}
    </SettingsBox>
  );
}

