import { useMemo } from 'react';
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
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: TimeDisplayProps) {
  const currentColor = color;
  const dayContainerHeightRem = 13.5;
  const { timerHeightPx } = useMemo(() => {
    const baseTimerHeightPx = 216;

    return {
      timerHeightPx: Math.round(baseTimerHeightPx * scaleFactor),
    };
  }, [scaleFactor]);


  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const showHours = (visibleUnits.days && days > 0) || (visibleUnits.hours && totalSeconds >= 3600);
  void unitLabels;
  const leftValue = showHours
    ? String(visibleUnits.days && days > 0 ? days : hours).padStart(2, '0')
    : String(minutes).padStart(2, '0');

  const rightValue = showHours
    ? String(minutes).padStart(2, '0')
    : String(seconds).padStart(2, '0');

  return (
    <>
      <div className="flex items-center justify-center" style={{ gap: '1rem', height: `${dayContainerHeightRem}rem` }}>
        <Display
          key={`timer-left-${scaleFactor}-${timerHeightPx}`}
          value={leftValue}
          count={2}
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
    </>
  );
}
