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
import { useCountdownStore } from '../../hooks/useCountdownStore';
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

  // Get visible units and unit labels from store
  const { visibleUnits, unitLabels } = useCountdownStore();

  // Common props for all display components
  const commonProps = {
    remainingMs,
    durationMs,
    color,
    backgroundColor,
    height: height * 0.8, // Slightly smaller to fit 4 in grid
    scaleFactor: scaleFactor * 0.8, // Scale down for grid layout
    visibleUnits,
    unitLabels,
  };

  // Render all four timer designs in a 2x2 grid
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '1rem',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Left - Digital / LED */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Digital / LED
          </div>
          <TimeDisplay {...commonProps} />
        </div>
      </div>

      {/* Top Right - Flip Clock */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Flip Clock
          </div>
          <FlipClockDisplay {...commonProps} />
        </div>
      </div>

      {/* Bottom Left - Circular Progress */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Circular Progress
          </div>
          <CircularProgressDisplay {...commonProps} />
        </div>
      </div>

      {/* Bottom Right - Block / Card Layout */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Block / Card Layout
          </div>
          <BlockCardDisplay {...commonProps} />
        </div>
      </div>
    </div>
  );
}
