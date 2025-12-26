import { useUiScale } from '../hooks/useUiScale';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { uiScale } = useUiScale();

  return (
    <footer className="tos-base border-t showcase" style={{ borderColor: 'var(--color-border)' }}>
      <div 
        className="max-w-5xl mx-auto text-center"
        style={{ 
          padding: `${1 * uiScale}rem ${1.5 * uiScale}rem`
        }}
      >
        <p 
          className="text-muted"
          style={{ fontSize: `${0.875 * uiScale}rem` }}
        >
          © {currentYear} TelemetryOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

