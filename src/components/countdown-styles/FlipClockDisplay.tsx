/**
 * FlipClockDisplay Component
 * 
 * Animated flip-style card display for countdown timer.
 * Uses @leenguyen/react-flip-clock-countdown for the flip animation effect.
 */

import { useMemo } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

interface FlipClockDisplayProps {
  remainingMs: number;
  durationMs?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
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

export default function FlipClockDisplay({
  remainingMs,
  color = '#00ff9c',
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: FlipClockDisplayProps) {
  const targetTime = useMemo(() => {
    return Date.now() + remainingMs;
  }, [remainingMs]);

  // Build labels array based on visibleUnits configuration
  // FlipClockCountdown requires exactly 4 labels, so we always provide 4
  const labels = useMemo(() => {
    const labelArray: string[] = [];
    if (visibleUnits.days) labelArray.push(unitLabels.days);
    if (visibleUnits.hours) labelArray.push(unitLabels.hours);
    if (visibleUnits.minutes) labelArray.push(unitLabels.minutes);
    if (visibleUnits.seconds) labelArray.push(unitLabels.seconds);
    // Ensure we have exactly 4 labels (pad with empty strings if needed)
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
          color: color,
        }}
        digitBlockStyle={{
          width: digitBlockWidth,
          height: digitBlockHeight,
          fontSize: digitBlockFontSize,
          backgroundColor: backgroundColor,
          color: color,
          borderRadius: '0.5rem',
        }}
        dividerStyle={{
          color: color,
          height: '1px',
        }}
        separatorStyle={{
          color: color,
          size: `${Math.round(6 * 3 * scaleFactor)}px`,
        }}
        duration={0.5}
      />
    </div>
  );
}

