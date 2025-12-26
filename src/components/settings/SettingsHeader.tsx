/**
 * Settings Header Component
 * 
 * Top-level header for the settings page with save and preview actions.
 * Follows TelemetryOS design system with responsive scaling.
 */

interface SettingsHeaderProps {
  onSave: () => void;
  onPreview: () => void;
  isSaving: boolean;
}

export default function SettingsHeader({ onSave, onPreview, isSaving }: SettingsHeaderProps) {
  return (
    <header 
      className="settings-header"
      style={{ 
        marginBottom: 'var(--space-6)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 
          style={{
            fontSize: 'clamp(1.25rem, 1.875rem, 2.5rem)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text)',
            margin: 0,
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--line-height-tight)',
          }}
        >
          Countdown Timer Settings
        </h1>
        <p 
          style={{
            fontSize: 'clamp(0.8125rem, 0.90625rem, 1rem)',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: 'var(--line-height-base)',
          }}
        >
          Configure your countdown display, messaging, and appearance
        </p>
      </div>
      <div className="settings-header__actions">
        <button
          type="button"
          onClick={onPreview}
          className="btn btn--secondary settings-header__btn"
          style={{
            fontSize: 'clamp(0.8125rem, 0.90625rem, 1rem)',
            padding: 'var(--space-3) var(--space-4)',
            whiteSpace: 'nowrap',
          }}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn settings-header__btn"
          style={{
            fontSize: 'clamp(0.8125rem, 0.90625rem, 1rem)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-accent)',
            color: '#000',
            whiteSpace: 'nowrap',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </header>
  );
}

