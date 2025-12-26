/**
 * Display Style Card Component
 * 
 * Choose the visual style of the countdown timer.
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import type { CountdownStore } from '../../store/countdownStore';

const DISPLAY_STYLES: Array<{
  value: CountdownStore['displayStyle'];
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'digital',
    label: 'Digital',
    description: '7-segment LED display',
    icon: '🔢',
  },
  {
    value: 'flip',
    label: 'Flip Clock',
    description: 'Retro flip board style',
    icon: '🔄',
  },
  {
    value: 'circular',
    label: 'Circular',
    description: 'Progress ring display',
    icon: '⭕',
  },
  {
    value: 'blocks',
    label: 'Block Cards',
    description: 'Bold card layout',
    icon: '📦',
  },
];

export default function DisplayStyleCard() {
  const { displayStyle, setDisplayStyle } = useCountdownStoreContext();

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            🎨 Display Style
          </h3>
        </div>

        <div className="display-style-grid"  style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 8rem), 1fr))',
          gap: 'clamp(0.5rem, 1.625rem, 0.75rem)',
        }}>
          {DISPLAY_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setDisplayStyle(style.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(0.75rem, 0.875rem, 1rem)',
                border: `${displayStyle === style.value ? '2px' : '1px'} solid ${
                  displayStyle === style.value ? 'var(--color-accent)' : 'var(--color-border)'
                }`,
                borderRadius: 'var(--radius-md)',
                background: displayStyle === style.value 
                  ? 'rgba(248, 179, 52, 0.1)' 
                  : 'var(--color-surface)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                minHeight: 'clamp(6rem, 6.5rem, 7rem)',
                touchAction: 'manipulation',
              }}
              className={displayStyle === style.value ? 'style-selected' : ''}
            >
              <span style={{ fontSize: 'clamp(1.5rem, 2rem, 2.5rem)', marginBottom: 'var(--space-2)' }}>
                {style.icon}
              </span>
              <span style={{
                fontSize: 'clamp(0.8125rem, 0.875rem, 0.9375rem)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-1)',
              }}>
                {style.label}
              </span>
              <span style={{
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}>
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

