export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="tos-base border-t showcase" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 py-4">
        <p className="text-sm text-muted text-center">
          © {currentYear} TelemetryOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

