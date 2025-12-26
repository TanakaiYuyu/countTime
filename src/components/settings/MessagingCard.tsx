/**
 * Messaging Card Component
 * 
 * Configure title and call-to-action text for the countdown display.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';

export default function MessagingCard() {
  const { titleRichText, setTitleRichText, ctaRichText, setCtaRichText } = useCountdownStoreContext();

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            💬 Messaging
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Title */}
          <div className="field">
            <label className="field__label" htmlFor="title-text">
              TITLE
            </label>
            <textarea
              id="title-text"
              className="input rich-text-textarea"
              value={titleRichText}
              onChange={(e) => setTitleRichText(e.target.value)}
              placeholder="e.g., New Year Countdown"
              rows={3}
              style={{
                fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                minHeight: '4.5rem',
              }}
            />
            <p style={{
              fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-2)',
              marginBottom: 0,
            }}>
              Main heading displayed above the countdown timer
            </p>
          </div>

          {/* Call to Action */}
          <div className="field">
            <label className="field__label" htmlFor="cta-text">
              CALL TO ACTION
            </label>
            <textarea
              id="cta-text"
              className="input rich-text-textarea"
              value={ctaRichText}
              onChange={(e) => setCtaRichText(e.target.value)}
              placeholder="e.g., Get ready to celebrate!"
              rows={3}
              style={{
                fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                minHeight: '4.5rem',
              }}
            />
            <p style={{
              fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-2)',
              marginBottom: 0,
            }}>
              Secondary message or tagline below the countdown
            </p>
          </div>

          {/* Preview */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-2)',
              fontWeight: 'var(--font-weight-medium)',
            }}>
              PREVIEW
            </div>
            {titleRichText && (
              <div style={{
                fontSize: 'clamp(1.125rem, 1.3125rem, 1.5rem)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)',
              }}>
                {titleRichText}
              </div>
            )}
            {ctaRichText && (
              <div style={{
                fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                color: 'var(--color-text-muted)',
              }}>
                {ctaRichText}
              </div>
            )}
            {!titleRichText && !ctaRichText && (
              <div style={{
                fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
              }}>
                No messaging configured
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

