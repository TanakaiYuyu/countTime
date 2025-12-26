/**
 * BlockCardDisplay Component
 * 
 * Block / Card Layout with separated blocks with distinct borders.
 * Each time unit (days, hours, minutes, seconds) is displayed in its own card.
 */

import { useMemo, useState, useEffect } from 'react';

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
  const [blinkColor, setBlinkColor] = useState(color);
  
  // Convert remainingMs to total seconds
  const totalSeconds = Math.floor(remainingMs / 1000);
  
  // Blink effect when less than 1 minute remains
  const isLastMinute = totalSeconds > 0 && totalSeconds < 60;
  
  useEffect(() => {
    if (!isLastMinute) {
      setBlinkColor(color);
      return;
    }

    const colors = [
      color,           // Original color
      '#FF0000',       // Red
      '#FF7F00',       // Orange
      '#FFFF00',       // Yellow
      '#00FF00',       // Cyan
      '#0000FF',       // Magenta
      '#8B00FF',       // Purple
    ];
    
    let colorIndex = 0;
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setBlinkColor(colors[colorIndex]);
    }, 1000); // Change color every 1000ms

    return () => clearInterval(interval);
  }, [isLastMinute, color]);

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Responsive sizing with clamp for fluid scaling
  const cardFontSize = `clamp(2.5rem, ${Math.round(64 * scaleFactor)}px, ${Math.round(80 * scaleFactor)}px)`;
  const labelFontSize = `clamp(0.75rem, ${Math.round(16 * scaleFactor)}px, ${Math.round(20 * scaleFactor)}px)`;
  const cardPadding = `clamp(1rem, ${Math.round(32 * scaleFactor)}px, ${Math.round(40 * scaleFactor)}px)`;
  const cardGap = `clamp(0.75rem, ${Math.round(24 * scaleFactor)}px, ${Math.round(32 * scaleFactor)}px)`;
  const borderWidth = Math.max(1, Math.round(2 * scaleFactor));
  const borderRadius = `clamp(0.5rem, ${Math.round(12 * scaleFactor)}px, ${Math.round(16 * scaleFactor)}px)`;
  const minCardWidth = `clamp(6rem, ${Math.round(120 * scaleFactor)}px, ${Math.round(150 * scaleFactor)}px)`;
  const textShadowBlur = `clamp(0.5rem, ${Math.round(10 * scaleFactor)}px, ${Math.round(15 * scaleFactor)}px)`;
  const marginBottom = `clamp(0.5rem, ${Math.round(12 * scaleFactor)}px, ${Math.round(16 * scaleFactor)}px)`;

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
    <div 
      className="flex items-center justify-center w-full h-full"
      style={{
        padding: 'clamp(1rem, 3vw, 3rem)',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: cardGap,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
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
              padding: cardPadding,
              border: `${borderWidth}px solid ${blinkColor}`,
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              minWidth: minCardWidth,
              boxShadow: `0 clamp(0.25rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem) rgba(0, 0, 0, 0.3), inset 0 0 0 ${borderWidth}px ${blinkColor}20`,
              transition: 'all 0.2s ease-out',
            }}
          >
            <div
              style={{
                fontSize: cardFontSize,
                fontWeight: 'bold',
                color: blinkColor,
                fontFamily: 'monospace',
                lineHeight: 1,
                marginBottom: marginBottom,
                textShadow: `0 0 ${textShadowBlur} ${blinkColor}80`,
                whiteSpace: 'nowrap',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: labelFontSize,
                color: blinkColor,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                whiteSpace: 'nowrap',
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

