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
  
  useEffect(() => {
    setTargetTime(Date.now() + remainingMs);
  }, [remainingMs]);

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

  // Scale the digit block size based on scaleFactor
  // Multiplied by 4 to make the flip timer 4x larger
  const digitBlockWidth = Math.round(40 * 3 * scaleFactor);
  const digitBlockHeight = Math.round(60 * 3 * scaleFactor);
  const digitBlockFontSize = Math.round(30 * 3 * scaleFactor);
  const labelFontSize = Math.round(10 * 3 * scaleFactor);

  return (
    <div className="flex items-center justify-center w-full h-full">
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
          backgroundColor: color || backgroundColor,
          color: '#FFFFFF',
          borderRadius: '0.5rem',
        }}
        dividerStyle={{
          color: '#FFFFFF',
          height: '1px',
        }}
        separatorStyle={{
          color: '#FFFFFF',
          size: `${Math.round(6 * 3 * scaleFactor)}px`,
        }}
        duration={0.5}
      />
    </div>
  );
}

