import { useState } from 'react';
import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsLabel,
  SettingsTextAreaFrame,
} from '@telemetryos/sdk/react';
import { useCountdownStoreContext } from '../../hooks/useCountdownStore';

export default function MessagingCard() {
  const { titleRichText, setTitleRichText, ctaRichText, setCtaRichText } = useCountdownStoreContext();
  const [focusedField, setFocusedField] = useState<'title' | 'cta' | null>(null);

  return (
    <SettingsBox>
      <SettingsHeading>Messaging</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Title Text (Above Countdown)</SettingsLabel>
        <div
          style={
            focusedField === 'title'
              ? { boxShadow: '0 0 0 0.125rem rgba(248,179,52,0.18)', borderRadius: 'var(--radius-md)' }
              : undefined
          }
        >
          <SettingsTextAreaFrame>
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
        </div>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Call-to-Action Text (Below Countdown)</SettingsLabel>
        <div
          style={
            focusedField === 'cta'
              ? { boxShadow: '0 0 0 0.125rem rgba(248,179,52,0.18)', borderRadius: 'var(--radius-md)' }
              : undefined
          }
        >
          <SettingsTextAreaFrame>
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
        </div>
      </SettingsField>
    </SettingsBox>
  );
}

