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
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Display Style
          </h2>
        </div>
        <div className="p-4">
          <div className="field">
            <label className="field__label">Visual Style</label>
            <div className="flex flex-col gap-3">
              {styles.map((style) => (
                <label
                  key={style.value}
                  className="display-option"
                  style={{
                    borderColor: displayStyle === style.value ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: displayStyle === style.value ? 'var(--color-surface-raised)' : 'var(--color-surface)',
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
                    if (displayStyle !== style.value) {
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (displayStyle !== style.value) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="displayStyle"
                    value={style.value}
                    checked={displayStyle === style.value}
                    onChange={(e) => setDisplayStyle(e.target.value as typeof displayStyle)}
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
                      {style.label}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-muted)',
                        lineHeight: 'var(--line-height-base)',
                      }}
                    >
                      {style.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

