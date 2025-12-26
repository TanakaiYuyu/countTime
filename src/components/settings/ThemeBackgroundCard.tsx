/**
 * Theme & Background Card Component
 * 
 * Configure colors and background settings following TelemetryOS guidelines:
 * - Default (smart background)
 * - Solid color
 * - Media (image/video)
 * - Transparency control
 * 
 * Follows TelemetryOS design guidelines with responsive scaling.
 */

import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import type { CountdownStore } from '../../store/countdownStore';

const BACKGROUND_TYPES: Array<{
  value: CountdownStore['backgroundType'];
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'default',
    label: 'Default',
    description: 'App smart background',
    icon: '✨',
  },
  {
    value: 'solid',
    label: 'Solid Color',
    description: 'Custom color',
    icon: '🎨',
  },
  {
    value: 'media',
    label: 'Media',
    description: 'Image or video',
    icon: '🖼️',
  },
];

export default function ThemeBackgroundCard() {
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    backgroundType,
    setBackgroundType,
    backgroundColor,
    setBackgroundColor,
    backgroundMediaId,
    setBackgroundMediaId,
    backgroundOpacity,
    setBackgroundOpacity,
  } = useCountdownStoreContext();

  return (
    <section className="section">
      <div className="card">
        <div className="card__header">
          <h3 className="card__title" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            🎨 Theme & Background
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Theme Colors Section */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-3)',
            }}>
              COLORS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Primary Color */}
              <div className="field">
                <label className="field__label" htmlFor="primary-color">
                  PRIMARY COLOR
                </label>
                <div className="color-picker-row">
                  <input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="color-picker"
                    aria-label="Primary color picker"
                  />
                  <input
                    type="text"
                    className="input color-input"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#f1f5f9"
                  />
                </div>
                <p style={{
                  fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-2)',
                  marginBottom: 0,
                }}>
                  Main countdown digits and primary text
                </p>
              </div>

              {/* Secondary Color */}
              <div className="field">
                <label className="field__label" htmlFor="secondary-color">
                  SECONDARY COLOR
                </label>
                <div className="color-picker-row">
                  <input
                    id="secondary-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="color-picker"
                    aria-label="Secondary color picker"
                  />
                  <input
                    type="text"
                    className="input color-input"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#cbd5e1"
                  />
                </div>
                <p style={{
                  fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-2)',
                  marginBottom: 0,
                }}>
                  Labels and secondary text elements
                </p>
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div>
            <div style={{
              fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-3)',
            }}>
              BACKGROUND
            </div>

            {/* Background Type Selector */}
            <div className="background-type-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 7rem), 1fr))',
              gap: 'clamp(0.5rem, 0.625rem, 0.75rem)',
              marginBottom: 'var(--space-4)',
            }}>
              {BACKGROUND_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setBackgroundType(type.value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(0.75rem, 0.875rem, 1rem)',
                    border: `${backgroundType === type.value ? '2px' : '1px'} solid ${
                      backgroundType === type.value ? 'var(--color-accent)' : 'var(--color-border)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    background: backgroundType === type.value
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

            {/* Solid Color Background */}
            {backgroundType === 'solid' && (
              <div className="field">
                <label className="field__label" htmlFor="background-color">
                  BACKGROUND COLOR
                </label>
                <div className="color-picker-row">
                  <input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="color-picker"
                    aria-label="Background color picker"
                  />
                  <input
                    type="text"
                    className="input color-input"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#0b0d17"
                  />
                </div>
              </div>
            )}

            {/* Media Background */}
            {backgroundType === 'media' && (
              <div className="field">
                <label className="field__label" htmlFor="background-media">
                  MEDIA ID
                </label>
                <input
                  id="background-media"
                  type="text"
                  className="input"
                  value={backgroundMediaId || ''}
                  onChange={(e) => setBackgroundMediaId(e.target.value || null)}
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

            {/* Default Background Info */}
            {backgroundType === 'default' && (
              <div style={{
                padding: 'var(--space-4)',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
                color: 'var(--color-text-muted)',
              }}>
                Using app's default smart background. Falls back to solid background color if none defined.
              </div>
            )}

            {/* Opacity Slider (for all background types) */}
            <div className="field" style={{ marginTop: 'var(--space-4)' }}>
              <label className="field__label" htmlFor="background-opacity">
                BACKGROUND OPACITY ({Math.round(backgroundOpacity * 100)}%)
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <input
                  id="background-opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={backgroundOpacity}
                  onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{
                  fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text)',
                  minWidth: '3rem',
                  textAlign: 'right',
                }}>
                  {Math.round(backgroundOpacity * 100)}%
                </span>
              </div>
              <p style={{
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-2)',
                marginBottom: 0,
              }}>
                Transparency of the background layer (content remains fully visible)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

