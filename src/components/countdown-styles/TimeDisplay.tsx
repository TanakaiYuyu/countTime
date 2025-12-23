/**
 * TimeDisplay Component
 * 
 * Displays time using react-7-segment-display with automatic mode switching:
 * - HH:MM mode when remaining time >= 1 hour
 * - MM:SS mode when remaining time < 1 hour
 * 
 * Display Logic:
 * - Always renders exactly 4 digits + colon (2 digits : 2 digits)
 * - Mode switches automatically based on remaining time
 * - No layout shift when switching modes (same structure)
 * - Color changes randomly every 2 seconds
 */

import { useMemo } from 'react';
// @ts-ignore - package doesn't have built dist, importing from source
import { Display } from 'react-7-segment-display/src/index';
import Colon from './Colon';

interface TimeDisplayProps {
  /** Remaining time in milliseconds */
  remainingMs: number;
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

export default function TimeDisplay({
  remainingMs,
  color = '#00ff9c',
  backgroundColor = '#000000',
  scaleFactor = 1.0,
  visibleUnits = { days: true, hours: true, minutes: true, seconds: true },
  unitLabels = { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
}: TimeDisplayProps) {
  // Use the provided color directly (no random color changes)
  const currentColor = color;
  
  // Get current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDayIndex = new Date().getDay();
  
  // Day names array (adjusted so Monday = 0, Sunday = 6)
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const adjustedDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
  
  // Get current date - format as DD/MM (day/month)
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Get AM/PM indicator
  const currentHours = now.getHours();
  const ampm = currentHours >= 12 ? 'PM' : 'AM';
  
  // Mock temperature (in a real app, this would come from an API or sensor)
  // Format: "XX°F" or "XX°C"
  const temperature = '72°F';
  
  // Base heights (for scale factor = 1.0, e.g., 1920x1080 resolution)
  // Calculate the height needed for the day container (7 days with gaps)
  // Each day label: 1.5rem height, gap between days: 0.5rem
  // Total: (7 * 1.5rem) + (6 * 0.5rem) = 10.5rem + 3rem = 13.5rem (216px at 16px/rem)
  // Note: rem units are already scaled by useUiScaleToSetRem, so don't multiply by scaleFactor
  const dayContainerHeightRem = 13.5; // rem for CSS - already scales via useUiScaleToSetRem
  
  // Pixel values for Display component - must be scaled manually since they're not rem
  // Use useMemo to recalculate when scaleFactor changes
  // Round to integers for cleaner rendering
  const { timerHeightPx, temperatureHeightPx, dateHeightPx } = useMemo(() => {
    const baseTimerHeightPx = 216; // pixels for Display component (at 1920x1080)
    const baseTemperatureHeightPx = 86; // pixels for Display component
    const baseDateHeightPx = 65; // pixels for Display component
    
    return {
      timerHeightPx: Math.round(baseTimerHeightPx * scaleFactor),
      temperatureHeightPx: Math.round(baseTemperatureHeightPx * scaleFactor),
      dateHeightPx: Math.round(baseDateHeightPx * scaleFactor),
    };
  }, [scaleFactor]);


  // Convert remaining milliseconds to total seconds
  const totalSeconds = Math.floor(remainingMs / 1000);
  
  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Display mode switching logic based on visible units and remaining time:
  // - If days are visible and > 0, or hours are visible and >= 1 hour, show HH:MM
  // - Otherwise, show MM:SS
  // Note: TimeDisplay uses a simplified display format (HH:MM or MM:SS),
  // so visibleUnits is used to determine display mode, but unitLabels is available
  // for consistency with other display components
  const showHours = (visibleUnits.days && days > 0) || (visibleUnits.hours && totalSeconds >= 3600);
  void unitLabels; // Suppress unused variable warning - available for consistency but not used in simplified display

  // Format values for display (always 2 digits)
  // If showing hours, display hours and minutes; otherwise display minutes and seconds
  const leftValue = showHours 
    ? String(visibleUnits.days && days > 0 ? days : hours).padStart(2, '0')      // DD or HH in HH:MM mode
    : String(minutes).padStart(2, '0');   // MM in MM:SS mode
  
  const rightValue = showHours
    ? String(minutes).padStart(2, '0')    // MM in HH:MM mode
    : String(seconds).padStart(2, '0');   // SS in MM:SS mode

  return (
    <>
      {/* CSS to remove color from inactive segments, remove shadows, and apply rainbow gradient */}
      <style>{`        
        /* Remove shadows/drop-shadows from all 7-segment displays */
        .seven-segment-timer .digit > div {
          filter: none !important;
        }
        
        /* Remove color from inactive segments (parts that don't appear in the 7-segment display) */
        .seven-segment-timer .digit > div > div[style*="opacity(0.3)"] {
          background-color: transparent !important;
          filter: none !important;
        }
        .seven-segment-timer .digit > div > div[style*="grayscale(0.7)"] {
          background-color: transparent !important;
          filter: none !important;
        }
      `}</style>
      <div className="seven-segment-timer flex flex-row items-center justify-center gap-2">
        <div
          className="flex flex-col items-center justify-center mr-8"
          style={{
            gap: '0.5rem',
            height: `${dayContainerHeightRem}rem`,
          }}
        >
          {dayNames.map((day, index) => {
            const isCurrentDay = index === adjustedDayIndex;
            // Only render the current day, hide all others
            if (!isCurrentDay) {
              return (
                <div
                  key={day}
                  style={{
                    fontSize: '1.25rem',
                    visibility: 'hidden',
                    height: '1.5rem', // Maintain spacing even when hidden
                  }}
                >
                  {day}
                </div>
              );
            }
            return (
              <div
                key={day}
                className="font-bold transition-colors duration-300"
                style={{
                  fontSize: '1.25rem',
                  color: currentColor,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        
          {/* AM/PM indicator - displayed between day and timer, both shown vertically with current one visible */}
        <div
          className="flex flex-col justify-around items-center mr-2"
          style={{
            height: `${dayContainerHeightRem}rem`,
          }}
        >
          {['AM', 'PM'].map((period) => {
            const isCurrentPeriod = period === ampm;
            // Only render the current period, hide the other
            if (!isCurrentPeriod) {
              return (
                <div
                  key={period}
                  className="invisible"
                  style={{
                    fontSize: '1.5rem',
                    height: '2rem', // Maintain spacing even when hidden
                  }}
                >
                  {period}
                </div>
              );
            }
            return (
                <div
                  key={period}
                  className="font-bold transition-colors duration-300"
                  style={{
                    fontSize: '1.5rem',
                    color: currentColor,
                    letterSpacing: '0.125rem',
                  }}
                >
                  {period}
                </div>
            );
          })}
        </div>
        
        {/* Timer display - height matches day container */}
        <div className="flex items-center" style={{ gap: '1rem', height: `${dayContainerHeightRem}rem` }}>
          {/* Left pair of digits (HH or MM) */}
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
          
          {/* Colon separator */}
          <Colon color={currentColor} height={timerHeightPx} />
          
          {/* Right pair of digits (MM or SS) */}
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
        
        {/* Temperature and Date - displayed vertically on the right */}
        <div
          className="flex flex-col items-center justify-center ml-4"
          style={{
            gap: '1rem',
            height: `${dayContainerHeightRem}rem`,
          }}
        >
          {/* Temperature - displayed in 7-segment format */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-row items-start gap-1">
              {/* Temperature digits in 7-segment format */}
              <Display
                key={`temp-${scaleFactor}-${temperatureHeightPx}`}
                value={temperature.replace('°F', '').replace('°C', '')}
                count={2}
                height={temperatureHeightPx}
                color={currentColor}
                backgroundColor={backgroundColor}
                skew={false}
                padding="0"
              />
              {/* Temperature unit */}
              <div
                className="font-bold transition-colors duration-300"
                style={{
                  fontSize: '1.125rem',
                  color: currentColor,
                }}
              >
                {temperature.includes('°F') ? '°F' : '°C'}
              </div>
            </div>
          </div>
          
          {/* Date - displayed as DD/MM in 7-segment format with labels below */}
          <div
            className="flex flex-row items-start gap-2"
          >
            {/* Day section with 7-segment display and DATE label */}
            <div
              className="flex flex-col items-center gap-1"
            >
              {/* Day digits in 7-segment format */}
              <Display
                key={`date-day-${scaleFactor.toFixed(3)}-${dateHeightPx.toFixed(1)}`}
                value={day}
                count={2}
                height={dateHeightPx}
                color={currentColor}
                backgroundColor={backgroundColor}
                skew={false}
                padding="0"
              />
              {/* DATE label below day digits */}
              <div
                className="font-normal transition-colors duration-300"
                style={{
                  fontSize: '0.75rem',
                  color: currentColor,
                  opacity: 0.8,
                }}
              >
                DATE
              </div>
            </div>
            
              {/* Separator */}
              <div
                className="self-center mt-2 font-bold transition-colors duration-300"
                style={{
                  fontSize: '1.125rem',
                  color: currentColor,
                }}
              >
                /
              </div>
            
            {/* Month section with 7-segment display and MONTH label */}
            <div
              className="flex flex-col items-center gap-1"
            >
              {/* Month digits in 7-segment format */}
              <Display
                key={`date-month-${scaleFactor}-${dateHeightPx}`}
                value={month}
                count={2}
                height={dateHeightPx}
                color={currentColor}
                backgroundColor={backgroundColor}
                skew={false}
                padding="0"
              />
              {/* MONTH label below month digits */}
              <div
                className="font-normal transition-colors duration-300"
                style={{
                  fontSize: '0.75rem',
                  color: currentColor,
                  opacity: 0.8,
                }}
              >
                MONTH
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
