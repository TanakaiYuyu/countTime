import { useState } from 'react';
import { useCountdownStore } from '../../hooks/useCountdownStore';
import { Bold, Italic, Type } from 'lucide-react';

export default function MessagingCard() {
  const { titleRichText, setTitleRichText, ctaRichText, setCtaRichText } = useCountdownStore();
  const [focusedField, setFocusedField] = useState<'title' | 'cta' | null>(null);

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Messaging
          </h2>
        </div>
        <div className="p-4">
          <div className="field">
            <label className="field__label">Title Text (Above Countdown)</label>
            <div
              className="rich-text-editor"
              style={{
                borderWidth: 'var(--border-width)',
                borderStyle: 'solid',
                borderColor: focusedField === 'title' ? 'var(--color-accent)' : 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                transition: 'all var(--transition-base)',
                ...(focusedField === 'title' && {
                  boxShadow: '0 0 0 0.125rem rgba(248, 179, 52, 0.1)',
                }),
              }}
            >
              <div
                className="rich-text-toolbar"
                style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-width) solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-raised)',
                  borderTopLeftRadius: 'var(--radius-sm)',
                  borderTopRightRadius: 'var(--radius-sm)',
                }}
              >
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Bold (coming soon)"
                >
                  <Bold size={14} />
                </button>
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Italic (coming soon)"
                >
                  <Italic size={14} />
                </button>
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Text Size (coming soon)"
                >
                  <Type size={14} />
                </button>
              </div>
              <textarea
                className="rich-text-textarea"
                rows={3}
                value={titleRichText}
                onChange={(e) => setTitleRichText(e.target.value)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter title text..."
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Call-to-Action Text (Below Countdown)</label>
            <div
              className="rich-text-editor"
              style={{
                borderWidth: 'var(--border-width)',
                borderStyle: 'solid',
                borderColor: focusedField === 'cta' ? 'var(--color-accent)' : 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                transition: 'all var(--transition-base)',
                ...(focusedField === 'cta' && {
                  boxShadow: '0 0 0 0.125rem rgba(248, 179, 52, 0.1)',
                }),
              }}
            >
              <div
                className="rich-text-toolbar"
                style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-width) solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-raised)',
                  borderTopLeftRadius: 'var(--radius-sm)',
                  borderTopRightRadius: 'var(--radius-sm)',
                }}
              >
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Bold (coming soon)"
                >
                  <Bold size={14} />
                </button>
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Italic (coming soon)"
                >
                  <Italic size={14} />
                </button>
                <button
                  className="rich-text-toolbar-btn"
                  type="button"
                  disabled
                  title="Text Size (coming soon)"
                >
                  <Type size={14} />
                </button>
              </div>
              <textarea
                className="rich-text-textarea"
                rows={3}
                value={ctaRichText}
                onChange={(e) => setCtaRichText(e.target.value)}
                onFocus={() => setFocusedField('cta')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter call-to-action text..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

