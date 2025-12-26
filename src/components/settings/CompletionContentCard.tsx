/**
 * Completion Content Card Component
 * 
 * Configure what displays when the countdown reaches zero.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import type { CountdownStore } from '../../store/countdownStore';

const COMPLETION_TYPES: Array<{
  value: CountdownStore['completionType'];
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'richText',
    label: 'Rich Text',
    description: 'Display custom message',
    icon: '📝',
  },
  {
    value: 'media',
    label: 'Media',
    description: 'Show image or video',
    icon: '🖼️',
  },
  {
    value: 'none',
    label: 'None',
    description: 'Hide countdown',
    icon: '🚫',
  },
];

export default function CompletionContentCard() {
  const {
    completionType,
    setCompletionType,
    completionRichText,
    setCompletionRichText,
    completionMediaId,
    setCompletionMediaId,
  } = useCountdownStoreContext();

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            🎉 Completion Content
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Completion Type Selector */}
          <div>
            <label className="field__label" style={{ marginBottom: 'var(--space-3)' }}>
              COMPLETION TYPE
            </label>
            <div className="completion-type-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 7rem), 1fr))',
              gap: 'clamp(0.5rem, 0.625rem, 0.75rem)',
            }}>
              {COMPLETION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setCompletionType(type.value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(0.75rem, 0.875rem, 1rem)',
                    border: `${completionType === type.value ? '2px' : '1px'} solid ${
                      completionType === type.value ? 'var(--color-accent)' : 'var(--color-border)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    background: completionType === type.value
                      ? 'rgba(248, 179, 52, 0.1)'
                      : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    minHeight: 'clamp(5.5rem, 5.75rem, 6rem)',
                    touchAction: 'manipulation',
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.5rem, 1.75rem, 2rem)', marginBottom: 'var(--space-2)' }}>
                    {type.icon}
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.8125rem, 0.84375rem, 0.875rem)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-1)',
                  }}>
                    {type.label}
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.6875rem, 0.71875rem, 0.75rem)',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                  }}>
                    {type.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rich Text Content */}
          {completionType === 'richText' && (
            <div className="field">
              <label className="field__label" htmlFor="completion-text">
                COMPLETION MESSAGE
              </label>
              <textarea
                id="completion-text"
                className="input rich-text-textarea"
                value={completionRichText}
                onChange={(e) => setCompletionRichText(e.target.value)}
                placeholder="e.g., Happy New Year! 🎊"
                rows={4}
                style={{
                  fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                  minHeight: '6rem',
                }}
              />
              <p style={{
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-2)',
                marginBottom: 0,
              }}>
                Message to display when countdown completes
              </p>
            </div>
          )}

          {/* Media ID Input */}
          {completionType === 'media' && (
            <div className="field">
              <label className="field__label" htmlFor="completion-media">
                MEDIA ID
              </label>
              <input
                id="completion-media"
                type="text"
                className="input"
                value={completionMediaId || ''}
                onChange={(e) => setCompletionMediaId(e.target.value || null)}
                placeholder="Enter TelemetryOS media ID"
                style={{ fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)' }}
              />
              <p style={{
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-2)',
                marginBottom: 0,
              }}>
                ID of the media asset from TelemetryOS media library
              </p>
            </div>
          )}

          {/* None Type Info */}
          {completionType === 'none' && (
            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
              color: 'var(--color-text-muted)',
            }}>
              The countdown will simply disappear when it reaches zero.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

