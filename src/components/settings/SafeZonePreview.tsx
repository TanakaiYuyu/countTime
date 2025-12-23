/**
 * SafeZonePreview Component
 * 
 * Visual overlay to preview the 5% safe zone inset for TelemetryOS guidelines.
 * Critical content should be kept within this safe zone to ensure visibility on all displays.
 */

interface SafeZonePreviewProps {
  /** Whether to show the safe zone overlay */
  enabled: boolean;
}

export default function SafeZonePreview({ enabled }: SafeZonePreviewProps) {
  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        border: '2px dashed rgba(255, 255, 255, 0.3)',
        pointerEvents: 'none',
        zIndex: 1000,
        borderRadius: 'var(--radius-sm)',
      }}
      aria-hidden="true"
    >
      {/* Corner indicators */}
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '1rem',
          height: '1rem',
          borderLeft: '2px solid rgba(255, 255, 255, 0.5)',
          borderTop: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '1rem',
          height: '1rem',
          borderRight: '2px solid rgba(255, 255, 255, 0.5)',
          borderTop: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          width: '1rem',
          height: '1rem',
          borderLeft: '2px solid rgba(255, 255, 255, 0.5)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '1rem',
          height: '1rem',
          borderRight: '2px solid rgba(255, 255, 255, 0.5)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      />
      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          padding: '0.25rem 0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-xs)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-family-base)',
        }}
      >
        Safe Zone (5%)
      </div>
    </div>
  );
}

