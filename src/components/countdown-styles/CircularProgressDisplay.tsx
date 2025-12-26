/**
 * CircularProgressDisplay Component
 * 
 * Circular progress ring with centered time value.
 * Uses react-countdown-circle-timer for the circular progress animation.
 */

import { useMemo, useState, useEffect, useRef } from 'react';

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
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: CircularProgressDisplayProps) {
  const [blinkColor, setBlinkColor] = useState(color);
  
  // Store the initial duration when the component mounts or durationMs increases
  // This ensures we have a stable reference for calculating progress
  const initialDurationRef = useRef<number>(durationMs || remainingMs);
  
  useEffect(() => {
    // Update initial duration only if the new duration is greater (i.e., timer reset)
    if (durationMs && durationMs > initialDurationRef.current) {
      initialDurationRef.current = durationMs;
    }
  }, [durationMs]);
  
  // Convert remainingMs to seconds
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  
  // Blink effect when less than 1 minute remains
  const isLastMinute = remainingSeconds > 0 && remainingSeconds < 60;
  
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
  
  // Use the stored initial duration for progress calculation
  // This ensures the progress ring correctly shows the percentage of time elapsed
  const totalDurationSeconds = Math.floor(initialDurationRef.current / 1000);
  const progressPercentage = totalDurationSeconds > 0 
    ? Math.max(0, Math.min(1, remainingSeconds / totalDurationSeconds))
    : 0;

  // Responsive sizing based on scaleFactor and viewport
  // Use clamp to ensure it adapts to container size
  const baseSize = 400;
  const size = Math.round(baseSize * scaleFactor);
  const strokeWidth = Math.round(12 * scaleFactor);
  
  // Responsive font sizes using clamp
  const fontSize = `clamp(2rem, ${Math.round(48 * scaleFactor)}px, ${Math.round(64 * scaleFactor)}px)`;
  const labelFontSize = `clamp(1rem, ${Math.round(24 * scaleFactor)}px, ${Math.round(32 * scaleFactor)}px)`;
  
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

  // Determine the current color based on progress and blink state
  const currentColor = useMemo(() => {
    // Use blink color if in last minute, otherwise use normal color logic
    if (isLastMinute) {
      return blinkColor;
    }
    if (progressPercentage > 0.5) {
      return color;
    } else if (progressPercentage > 0.25) {
      return color;
    } else {
      return `${color}80`; // Dimmed color when low
    }
  }, [color, progressPercentage, isLastMinute, blinkColor]);

  return (
    <div 
      className="flex items-center justify-center w-full h-full"
      style={{
        padding: 'clamp(1rem, 3vw, 3rem)',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: `min(${size}px, 90vw, 90vh)`,
          height: `min(${size}px, 90vw, 90vh)`,
          aspectRatio: '1',
        }}
      >
        {/* SVG Progress Ring */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          preserveAspectRatio="xMidYMid meet"
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
            gap: 'clamp(0.25rem, 1vw, 0.75rem)',
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          <div
            style={{
              fontSize: fontSize,
              fontWeight: 'bold',
              color: blinkColor,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            {timeString}
          </div>
          <div
            style={{
              fontSize: labelFontSize,
              color: blinkColor,
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            {days > 0 || hours > 0 ? 'Time Remaining' : 'Countdown'}
          </div>
        </div>
      </div>
    </div>
  );
}

