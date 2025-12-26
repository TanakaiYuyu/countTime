import { useMemo, useState, useEffect } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

interface FlipClockDisplayProps {
  remainingMs: number;
  durationMs?: number;
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

export default function FlipClockDisplay({
  remainingMs,
  color = '#00ff9c',
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: FlipClockDisplayProps) {
  const [targetTime, setTargetTime] = useState(() => Date.now() + remainingMs);
  const [blinkColor, setBlinkColor] = useState(color);
  
  useEffect(() => {
    setTargetTime(Date.now() + remainingMs);
  }, [remainingMs]);

  // Blink effect when less than 1 minute remains
  const totalSeconds = Math.floor(remainingMs / 1000);
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

  const labels = useMemo(() => {
    const labelArray: string[] = [];
    if (visibleUnits.days) labelArray.push(unitLabels.days);
    if (visibleUnits.hours) labelArray.push(unitLabels.hours);
    if (visibleUnits.minutes) labelArray.push(unitLabels.minutes);
    if (visibleUnits.seconds) labelArray.push(unitLabels.seconds);
    while (labelArray.length < 4) {
      labelArray.push('');
    }
    return [labelArray[0], labelArray[1], labelArray[2], labelArray[3]] as [string, string, string, string];
  }, [visibleUnits, unitLabels]);

  // Responsive sizing based on scaleFactor with clamp for fluid scaling
  // Base values multiplied by 3 for larger display, then made responsive
  const baseWidth = 40 * 3;
  const baseHeight = 60 * 3;
  const baseFontSize = 30 * 3;
  const baseLabelSize = 10 * 3;
  const baseSeparatorSize = 6 * 3;

  // Apply scaleFactor and make responsive with viewport-aware sizing
  const digitBlockWidth = Math.round(baseWidth * scaleFactor);
  const digitBlockHeight = Math.round(baseHeight * scaleFactor);
  const digitBlockFontSize = Math.round(baseFontSize * scaleFactor);
  const labelFontSize = Math.round(baseLabelSize * scaleFactor);
  const separatorSize = Math.round(baseSeparatorSize * scaleFactor);

  return (
    <div 
      className="flex items-center justify-center w-full h-full"
      style={{
        padding: 'clamp(0.5rem, 2vw, 2rem)',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ 
        transform: `scale(${Math.min(1, scaleFactor)})`,
        transformOrigin: 'center',
        maxWidth: '100%',
      }}>
        <FlipClockCountdown
          to={targetTime}
          labels={labels}
          labelStyle={{
            fontSize: labelFontSize,
            fontWeight: 500,
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
          digitBlockStyle={{
            width: digitBlockWidth,
            height: digitBlockHeight,
            fontSize: digitBlockFontSize,
            // Card takes the accent color; digits invert to white for contrast
            backgroundColor: blinkColor || backgroundColor,
            color: '#FFFFFF',
            borderRadius: 'clamp(0.25rem, 0.5vw, 0.75rem)',
          }}
          dividerStyle={{
            color: '#FFFFFF',
            height: '1px',
          }}
          separatorStyle={{
            color: '#FFFFFF',
            size: `${separatorSize}px`,
          }}
          duration={0.5}
        />
      </div>
    </div>
  );
}

