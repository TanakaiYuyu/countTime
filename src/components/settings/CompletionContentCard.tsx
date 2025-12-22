import { useCountdownStore } from '../../hooks/useCountdownStore';

export default function CompletionContentCard() {
  const {
    completionType,
    setCompletionType,
    completionRichText,
    setCompletionRichText,
    completionMediaId,
    setCompletionMediaId,
  } = useCountdownStore();

  const types = [
    {
      value: 'richText' as const,
      label: 'Rich Text Message',
      desc: 'Display a formatted text message',
    },
    { value: 'media' as const, label: 'Image / Video', desc: 'Show media content' },
    { value: 'none' as const, label: 'None', desc: 'Keep showing countdown at 00:00:00' },
  ];

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Completion Content
          </h2>
        </div>
        <div className="p-4">
          <div className="field">
            <label className="field__label">When Countdown Reaches Zero</label>
            <div className="flex flex-col gap-3">
              {types.map((type) => (
                <label
                  key={type.value}
                  className="completion-option"
                  style={{
                    borderColor:
                      completionType === type.value ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor:
                      completionType === type.value
                        ? 'var(--color-surface-raised)'
                        : 'var(--color-surface)',
                    borderWidth: 'var(--border-width)',
                    borderStyle: 'solid',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-4)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                  }}
                  onMouseEnter={(e) => {
                    if (completionType !== type.value) {
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completionType !== type.value) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="completionType"
                    value={type.value}
                    checked={completionType === type.value}
                    onChange={(e) =>
                      setCompletionType(e.target.value as typeof completionType)
                    }
                    style={{ marginTop: '0.25rem', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 'var(--font-weight-semibold)',
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      {type.label}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-muted)',
                        lineHeight: 'var(--line-height-base)',
                      }}
                    >
                      {type.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {completionType === 'richText' && (
            <div className="field" style={{ marginTop: 'var(--space-6)' }}>
              <label className="field__label">Completion Message</label>
              <textarea
                className="input"
                rows={3}
                value={completionRichText}
                onChange={(e) => setCompletionRichText(e.target.value)}
                placeholder="Enter completion message..."
                style={{
                  resize: 'vertical',
                  minHeight: '4.5rem',
                }}
              />
            </div>
          )}

          {completionType === 'media' && (
            <div className="field" style={{ marginTop: 'var(--space-6)' }}>
              <label className="field__label">Media Selection</label>
              <div
                style={{
                  border: 'var(--border-width) dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-surface-raised)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                }}
              >
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Media picker placeholder
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {completionMediaId ? `Media ID: ${completionMediaId}` : 'No media selected'}
                </p>
                <button
                  className="btn btn--secondary"
                  type="button"
                  style={{ fontSize: 'var(--font-size-sm)' }}
                >
                  Select Media
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

