/**
 * CountTimer Component
 * 
 * A drift-free countdown timer that displays remaining time in different visual styles.
 * Supports four display styles: digital/LED, flip clock, circular progress, and block/card layout.
 * 
 * Uses wall-clock delta timing with requestAnimationFrame for accurate counting
 * over long durations without cumulative drift errors.
 */

import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import TimeDisplay from './TimeDisplay';
import FlipClockDisplay from './FlipClockDisplay';
import CircularProgressDisplay from './CircularProgressDisplay';
import BlockCardDisplay from './BlockCardDisplay';

interface CountTimerProps {
  /** Initial duration in milliseconds */
  durationMs: number;
  /** Callback fired once when timer reaches zero */
  onComplete?: () => void;
  /** Color for active LED segments */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Height of digits */
  height?: number;
  /** Scale factor for responsive sizing */
  scaleFactor?: number;
  /** Selected display style */
  displayStyle: 'digital' | 'flip' | 'circular' | 'blocks';
  /** Visible units */
  visibleUnits: {
    days: boolean;
    hours: boolean;
    minutes: boolean;
    seconds: boolean;
  };
  /** Unit labels */
  unitLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function CountTimer({
  durationMs,
  onComplete,
  color = '#00ff9c',
  backgroundColor = '#000000',
  height = 250,
  scaleFactor = 1.0,
  displayStyle,
  visibleUnits,
  unitLabels,
}: CountTimerProps) {
  // Use custom hook for drift-free countdown timing
  const { remainingMs } = useCountdownTimer({
    durationMs,
    onComplete,
  });

  // Common props for all display components
  const commonProps = {
    remainingMs,
    durationMs,
    color,
    backgroundColor,
    height: height,
    scaleFactor,
    visibleUnits,
    unitLabels,
  };

  if (displayStyle === 'flip') {
    return <FlipClockDisplay {...commonProps} />;
  }
  if (displayStyle === 'circular') {
    return <CircularProgressDisplay {...commonProps} />;
  }
  if (displayStyle === 'blocks') {
    return <BlockCardDisplay {...commonProps} />;
  }
  return <TimeDisplay {...commonProps} />;
}
