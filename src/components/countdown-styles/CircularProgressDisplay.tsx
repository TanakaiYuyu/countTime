/**
 * CircularProgressDisplay Component
 * 
 * Circular progress ring with centered time value.
 * Uses react-countdown-circle-timer for the circular progress animation.
 */

import { useMemo } from 'react';

interface CircularProgressDisplayProps {
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

export default function CircularProgressDisplay({
  remainingMs,
  durationMs,
  color = '#00ff9c',
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: CircularProgressDisplayProps) {
  // Convert remainingMs to seconds
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  
  // Use the initial duration if provided, otherwise default to 24 hours
  const totalDurationSeconds = durationMs ? Math.floor(durationMs / 1000) : 86400;
  const progressPercentage = totalDurationSeconds > 0 
    ? Math.min(1, remainingSeconds / totalDurationSeconds) 
    : 0;

  // Scale the size based on scaleFactor
  const size = Math.round(400 * scaleFactor);
  const strokeWidth = Math.round(12 * scaleFactor);
  const fontSize = Math.round(48 * scaleFactor);
  const labelFontSize = Math.round(24 * scaleFactor);
  
  // Calculate the stroke-dasharray and stroke-dashoffset for the progress ring
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage * circumference);

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  // Format time string based on visible units
  const timeString = useMemo(() => {
    const parts: string[] = [];
    if (visibleUnits.days && days > 0) {
      parts.push(String(days).padStart(2, '0'));
    }
    if (visibleUnits.hours && (hours > 0 || days > 0)) {
      parts.push(String(hours).padStart(2, '0'));
    }
    if (visibleUnits.minutes) {
      parts.push(String(minutes).padStart(2, '0'));
    }
    if (visibleUnits.seconds) {
      parts.push(String(seconds).padStart(2, '0'));
    }
    return parts.join(':') || '00:00';
  }, [days, hours, minutes, seconds, visibleUnits]);
  
  // Note: unitLabels parameter is available for consistency with other display components
  // but not actively used in the circular display format since it shows time values directly
  void unitLabels; // Suppress unused variable warning

  // Determine the current color based on progress
  const currentColor = useMemo(() => {
    if (progressPercentage > 0.5) {
      return color;
    } else if (progressPercentage > 0.25) {
      return color;
    } else {
      return `${color}80`; // Dimmed color when low
    }
  }, [color, progressPercentage]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
        </svg>
        
        {/* Centered content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 'bold',
              color: color,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            {timeString}
          </div>
          <div
            style={{
              fontSize: `${labelFontSize}px`,
              color: color,
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {days > 0 || hours > 0 ? 'Time Remaining' : 'Countdown'}
          </div>
        </div>
      </div>
    </div>
  );
}

