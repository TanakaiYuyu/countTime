import { useMemo, useState, useEffect } from 'react';
import { Display } from 'react-7-segment-display/src/index';
import Colon from './Colon';

interface TimeDisplayProps {
  remainingMs: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  scaleFactor?: number;
  visibleUnits?: {
    days: boolean;
    hours: boolean;
    minutes: boolean;
    seconds: boolean;
  };
  unitLabels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function TimeDisplay({
  remainingMs,
  color = '#00ff9c',
  backgroundColor = 'rgba(0, 0, 0, 0.02)',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: TimeDisplayProps) {
  const [blinkColor, setBlinkColor] = useState(color);
  
  // Responsive height calculation using clamp() for fluid sizing
  const { timerHeightPx, containerHeight } = useMemo(() => {
    // Base height scales with viewport and container, with scaleFactor applied
    const baseTimerHeightPx = 216;
    const calculatedHeight = Math.round(baseTimerHeightPx * scaleFactor);
    
    return {
      timerHeightPx: calculatedHeight,
      // Container height is responsive with clamp
      containerHeight: `clamp(10rem, ${calculatedHeight / 16}rem, 20rem)`,
    };
  }, [scaleFactor]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Blink effect when less than 1 minute remains
  const isLastMinute = totalSeconds > 0 && totalSeconds < 60;
  
  useEffect(() => {
    if (!isLastMinute) {
      setBlinkColor(color);
      return;
    }

    // Alternate between multiple colors for dramatic effect
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

  const currentColor = blinkColor;
  void unitLabels;
  void visibleUnits; // Not used in digital display format

  // Dynamic format: DDD:HH (or DD:HH) -> HH:MM -> MM:SS
  // When days >= 100 (approaching/over a year), use 3 digits for days
  let leftValue: string;
  let rightValue: string;
  let leftDigitCount: number;

  if (days > 0) {
    // Format: DD:HH or DDD:HH (days:hours)
    // Use 3 digits when days >= 100 to accommodate values over a year
    if (days >= 100) {
      leftValue = String(days).padStart(3, '0'); // DDD format (up to 999 days)
      leftDigitCount = 3;
    } else {
      leftValue = String(days).padStart(2, '0'); // DD format
      leftDigitCount = 2;
    }
    rightValue = String(hours).padStart(2, '0');
  } else if (hours > 0) {
    // Format: HH:MM (hours:minutes)
    leftValue = String(hours).padStart(2, '0');
    rightValue = String(minutes).padStart(2, '0');
    leftDigitCount = 2;
  } else {
    // Format: MM:SS (minutes:seconds)
    leftValue = String(minutes).padStart(2, '0');
    rightValue = String(seconds).padStart(2, '0');
    leftDigitCount = 2;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div 
        className="flex items-center justify-center" 
        style={{ 
          gap: 'clamp(0.5rem, 2vw, 2rem)',
          height: containerHeight,
          maxWidth: '100%',
        }}
      >
        <Display
          key={`timer-left-${scaleFactor}-${timerHeightPx}-${leftDigitCount}`}
          value={leftValue}
          count={leftDigitCount}
          height={timerHeightPx}
          color={currentColor}
          backgroundColor={backgroundColor}
          skew={false}
          padding="0"
        />

        <Colon color={currentColor} height={timerHeightPx} />

        <Display
          key={`timer-right-${scaleFactor}-${timerHeightPx}`}
          value={rightValue}
          count={2}
          height={timerHeightPx}
          color={currentColor}
          backgroundColor={backgroundColor}
          skew={false}
          padding="0"
        />
      </div>
    </div>
  );
}
