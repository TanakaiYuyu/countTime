/**
 * useCountdownTimer Hook
 * 
 * Custom hook for drift-free countdown timing using wall-clock delta calculation.
 * Uses Date.now() and requestAnimationFrame to ensure accuracy over long durations.
 * 
 * Timing Logic:
 * - Stores startTimestamp when timer begins
 * - Calculates elapsed time as: elapsed = Date.now() - startTimestamp
 * - Calculates remaining time as: remaining = durationMs - elapsed
 * - Updates via requestAnimationFrame for smooth rendering
 * - No setInterval to avoid cumulative drift errors
 */

import { useEffect, useRef, useState } from 'react';

interface UseCountdownTimerOptions {
  /** Initial duration in milliseconds */
  durationMs: number;
  /** Callback fired once when timer reaches zero */
  onComplete?: () => void;
}

interface UseCountdownTimerReturn {
  /** Remaining time in milliseconds */
  remainingMs: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
}

export function useCountdownTimer({
  durationMs,
  onComplete,
}: UseCountdownTimerOptions): UseCountdownTimerReturn {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(durationMs > 0);

  // Track start time and initial duration for drift-free calculation
  // Using refs to avoid re-running effects on every render
  const startTimeRef = useRef<number>(Date.now());
  const initialDurationRef = useRef<number>(durationMs);
  const animationFrameRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer logic: reset and start countdown when durationMs changes
  useEffect(() => {
    // Cancel any existing animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Reset start time to current wall-clock time
    startTimeRef.current = Date.now();
    initialDurationRef.current = durationMs;
    setRemainingMs(durationMs);
    setIsRunning(durationMs > 0);

    // Animation loop using requestAnimationFrame
    // This ensures drift-free timing by calculating elapsed time from wall-clock
    const updateTimer = () => {
      const now = Date.now();
      // Calculate elapsed time since start
      const elapsed = now - startTimeRef.current;
      // Calculate remaining time (clamped to 0)
      const remaining = Math.max(0, initialDurationRef.current - elapsed);

      setRemainingMs(remaining);

      // Continue animation if time remains
      if (remaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        // Timer reached zero - stop animation and call callback
        animationFrameRef.current = null;
        setIsRunning(false);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    // Start the animation loop if duration is greater than 0
    if (durationMs > 0) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      setIsRunning(false);
    }

    // Cleanup: cancel animation frame when duration changes or component unmounts
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [durationMs]);

  return {
    remainingMs,
    isRunning,
  };
}

