/**
 * BlockCardDisplay Component
 * 
 * Block / Card Layout with separated blocks with distinct borders.
 * Each time unit (days, hours, minutes, seconds) is displayed in its own card.
 */

import { useMemo } from 'react';

interface BlockCardDisplayProps {
  /** Remaining time in milliseconds */
  remainingMs: number;
  /** Initial duration in milliseconds */
  durationMs?: number;
  /** Color for active segments */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Height of digits */
  height?: number;
  /** Scale factor for responsive sizing */
  scaleFactor?: number;
  /** Visible time units configuration */
  visibleUnits?: {
    days: boolean;
    hours: boolean;
    minutes: boolean;
    seconds: boolean;
  };
  /** Unit labels configuration */
  unitLabels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function BlockCardDisplay({
  remainingMs,
  color = '#00ff9c',
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: BlockCardDisplayProps) {
  // Convert remainingMs to total seconds
  const totalSeconds = Math.floor(remainingMs / 1000);

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Scale font sizes based on scaleFactor
  const cardFontSize = Math.round(64 * scaleFactor);
  const labelFontSize = Math.round(16 * scaleFactor);
  const cardPadding = Math.round(32 * scaleFactor);
  const cardGap = Math.round(24 * scaleFactor);
  const borderWidth = Math.round(2 * scaleFactor);
  const borderRadius = Math.round(12 * scaleFactor);

  // Build time units array based on visibleUnits configuration
  const timeUnits = useMemo(
    () => {
      const units: Array<{ value: number; label: string; key: string }> = [];
      if (visibleUnits.days) units.push({ value: days, label: unitLabels.days, key: 'days' });
      if (visibleUnits.hours) units.push({ value: hours, label: unitLabels.hours, key: 'hours' });
      if (visibleUnits.minutes) units.push({ value: minutes, label: unitLabels.minutes, key: 'minutes' });
      if (visibleUnits.seconds) units.push({ value: seconds, label: unitLabels.seconds, key: 'seconds' });
      return units;
    },
    [days, hours, minutes, seconds, visibleUnits, unitLabels]
  );

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        style={{
          display: 'flex',
          gap: `${cardGap}px`,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {timeUnits.map((unit) => (
          <div
            key={unit.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${cardPadding}px`,
              border: `${borderWidth}px solid ${color}`,
              borderRadius: `${borderRadius}px`,
              backgroundColor: backgroundColor,
              minWidth: `${Math.round(120 * scaleFactor)}px`,
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 ${borderWidth}px ${color}20`,
            }}
          >
            <div
              style={{
                fontSize: `${cardFontSize}px`,
                fontWeight: 'bold',
                color: color,
                fontFamily: 'monospace',
                lineHeight: 1,
                marginBottom: `${Math.round(12 * scaleFactor)}px`,
                textShadow: `0 0 ${Math.round(10 * scaleFactor)}px ${color}80`,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: `${labelFontSize}px`,
                color: color,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
              }}
            >
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

