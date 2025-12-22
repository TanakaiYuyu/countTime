/**
 * CountTimer Component
 * 
 * A drift-free countdown timer that displays remaining time using react-7-segment-display.
 * Automatically switches between HH:MM and MM:SS display modes based on remaining time.
 * 
 * Uses wall-clock delta timing with requestAnimationFrame for accurate counting
 * over long durations without cumulative drift errors.
 */

import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import TimeDisplay from './TimeDisplay';

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
}

export default function CountTimer({
  durationMs,
  onComplete,
  color = '#00ff9c',
  backgroundColor = '#000000',
  height = 250,
  scaleFactor = 1.0,
}: CountTimerProps) {
  // Use custom hook for drift-free countdown timing
  const { remainingMs } = useCountdownTimer({
    durationMs,
    onComplete,
  });

  return (
    <div className="flex items-center justify-center w-full h-full">
      <TimeDisplay
        remainingMs={remainingMs}
        color={color}
        backgroundColor={backgroundColor}
        height={height}
        scaleFactor={scaleFactor}
      />
    </div>
  );
}
