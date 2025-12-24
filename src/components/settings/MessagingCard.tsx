import { useState } from 'react';
import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsLabel,
  SettingsTextAreaFrame,
} from '@telemetryos/sdk/react';
import { useCountdownStore } from '../../hooks/useCountdownStore';

export default function MessagingCard() {
  const { titleRichText, setTitleRichText, ctaRichText, setCtaRichText } = useCountdownStore();
  const [focusedField, setFocusedField] = useState<'title' | 'cta' | null>(null);

  return (
    <SettingsBox>
      <SettingsHeading>Messaging</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Title Text (Above Countdown)</SettingsLabel>
        <SettingsTextAreaFrame
          className={focusedField === 'title' ? 'shadow-lg' : ''}
        >
          <textarea
            rows={3}
            value={titleRichText}
            onChange={(e) => setTitleRichText(e.target.value)}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter title text..."
            className="w-full"
            style={{
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text)',
              resize: 'vertical',
            }}
          />
        </SettingsTextAreaFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Call-to-Action Text (Below Countdown)</SettingsLabel>
        <SettingsTextAreaFrame
          className={focusedField === 'cta' ? 'shadow-lg' : ''}
        >
          <textarea
            rows={3}
            value={ctaRichText}
            onChange={(e) => setCtaRichText(e.target.value)}
            onFocus={() => setFocusedField('cta')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter call-to-action text..."
            className="w-full"
            style={{
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text)',
              resize: 'vertical',
            }}
          />
        </SettingsTextAreaFrame>
      </SettingsField>
    </SettingsBox>
  );
}

