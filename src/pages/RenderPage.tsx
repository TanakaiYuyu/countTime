import { useEffect, useState, useMemo } from 'react';
import { media } from '@telemetryos/sdk';
import { useCountdownStoreContext } from '../hooks/useCountdownStore';
import { defaultStore } from '../store/countdownStore';
import CountTimer from '../components/countdown-styles/CountTimer';
import { useUiScale } from '../hooks/useUiScale';

export default function RenderPage() {
  const { uiScale } = useUiScale();

  const {
    targetDateTime,
    timezone,
    completionDurationMs,
    primaryColor,
    backgroundType,
    backgroundColor,
    backgroundMediaId,
    backgroundOpacity,
    displayStyle,
    visibleUnits,
    unitLabels,
    titleRichText,
    ctaRichText,
    completionTimeMode,
    completionTimeValue,
    completionType,
    completionRichText,
    completionMediaId,
    secondaryColor,
  } = useCountdownStoreContext();

  useEffect(() => {
    console.log('=== RENDER PAGE - LOADED SETTINGS FROM STORE ===');
    const allSettings = {
      targetDateTime,
      timezone,
      completionDurationMs,
      displayStyle,
      visibleUnits,
      unitLabels,
      titleRichText,
      ctaRichText,
      completionTimeMode,
      completionTimeValue,
      completionType,
      completionRichText,
      completionMediaId,
      primaryColor,
      secondaryColor,
      backgroundType,
      backgroundColor,
      backgroundMediaId,
      backgroundOpacity,
    };
    console.log('All settings from store (formatted):', JSON.stringify(allSettings, null, 2));
    
    console.log('=== COMPARING WITH DEFAULTS ===');
    const differences: string[] = [];
    Object.keys(allSettings).forEach((key) => {
      const currentValue = (allSettings as Record<string, unknown>)[key];
      const defaultValue = (defaultStore as unknown as Record<string, unknown>)[key];
      const isDifferent = JSON.stringify(currentValue) !== JSON.stringify(defaultValue);
      if (isDifferent) {
        differences.push(key);
        console.log(`  ✓ ${key} is DIFFERENT from default:`, { 
          current: currentValue, 
          default: defaultValue 
        });
      } else {
        console.log(`  - ${key} matches default:`, currentValue);
      }
    });
    console.log(`Found ${differences.length} settings that differ from defaults:`, differences);
    
    console.log('Individual values:');
    console.log('  targetDateTime:', targetDateTime);
    console.log('  timezone:', timezone);
    console.log('  completionDurationMs:', completionDurationMs);
    console.log('  displayStyle:', displayStyle);
    console.log('  visibleUnits:', JSON.stringify(visibleUnits, null, 2));
    console.log('  unitLabels:', JSON.stringify(unitLabels, null, 2));
    console.log('  titleRichText:', titleRichText);
    console.log('  ctaRichText:', ctaRichText);
    console.log('  completionTimeMode:', completionTimeMode);
    console.log('  completionTimeValue:', completionTimeValue);
    console.log('  completionType:', completionType);
    console.log('  completionRichText:', completionRichText);
    console.log('  completionMediaId:', completionMediaId);
    console.log('  primaryColor:', primaryColor);
    console.log('  secondaryColor:', secondaryColor);
    console.log('  backgroundType:', backgroundType);
    console.log('  backgroundColor:', backgroundColor);
    console.log('  backgroundMediaId:', backgroundMediaId);
    console.log('  backgroundOpacity:', backgroundOpacity);
  }, [
    targetDateTime,
    timezone,
    displayStyle,
    visibleUnits,
    unitLabels,
    titleRichText,
    ctaRichText,
    completionTimeMode,
    completionTimeValue,
    completionType,
    completionRichText,
    completionMediaId,
    primaryColor,
    secondaryColor,
    backgroundType,
    backgroundColor,
    backgroundMediaId,
    backgroundOpacity,
    completionDurationMs,
  ]);

  // Calculate countdown duration from target date/time
  // Note: completionDurationMs in store is for "how long to show completion content", not countdown duration
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Update current time every second to keep countdown accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownDurationMs = useMemo(() => {
    // Calculate from target date/time
    if (targetDateTime) {
      try {
        // Parse the target date/time (it's already in ISO format from the picker)
        const targetDate = new Date(targetDateTime);
        
        // The targetDateTime from the picker is already in the selected timezone
        // We just need to calculate the difference from now
        const target = targetDate.getTime();
        const remaining = Math.max(0, target - currentTime);
        
        console.log('Countdown calculation:', {
          targetDateTime,
          timezone,
          targetDate: targetDate.toISOString(),
          targetLocal: targetDate.toLocaleString(),
          currentTime: new Date(currentTime).toISOString(),
          currentLocal: new Date(currentTime).toLocaleString(),
          remaining,
          remainingDays: Math.floor(remaining / (1000 * 60 * 60 * 24)),
          remainingHours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          remainingMinutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
          remainingSeconds: Math.floor((remaining % (1000 * 60)) / 1000)
        });
        
        return remaining;
      } catch (error) {
        console.error('Error calculating target date:', error);
        return 0;
      }
    }
    
    // No target date set - show 00:00:00
    return 0;
  }, [targetDateTime, timezone, currentTime]);

  const [backgroundMedia, setBackgroundMedia] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);

  const [completionMedia, setCompletionMedia] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!backgroundMediaId) {
      setBackgroundMedia(null);
      return;
    }
    media()
      .getById(backgroundMediaId)
      .then((item) => {
        if (cancelled) return;
        const url = item.publicUrls?.[0] || item.thumbnailUrl;
        if (!url) {
          setBackgroundMedia(null);
          return;
        }
        const type = item.contentType.startsWith('video') ? 'video' : 'image';
        setBackgroundMedia({ url, type });
      })
      .catch(() => {
        if (!cancelled) setBackgroundMedia(null);
      });
    return () => {
      cancelled = true;
    };
  }, [backgroundMediaId]);

  useEffect(() => {
    let cancelled = false;
    if (!completionMediaId) {
      setCompletionMedia(null);
      return;
    }
    media()
      .getById(completionMediaId)
      .then((item) => {
        if (cancelled) return;
        const url = item.publicUrls?.[0] || item.thumbnailUrl;
        if (!url) {
          setCompletionMedia(null);
          return;
        }
        const type = item.contentType.startsWith('video') ? 'video' : 'image';
        setCompletionMedia({ url, type });
      })
      .catch(() => {
        if (!cancelled) setCompletionMedia(null);
      });
    return () => {
      cancelled = true;
    };
  }, [completionMediaId]);

  const getBackgroundStyle = () => {
    const bgType = backgroundType || defaultStore.backgroundType;
    const bgColor = backgroundColor || defaultStore.backgroundColor;

    if (bgType === 'solid') {
      return {
        backgroundColor: bgColor,
        opacity: 1, // Opacity is handled by the background color itself or the media overlay
      };
    }
    if (bgType === 'media' && backgroundMedia) {
      return {
        backgroundColor: bgColor || 'hsl(210, 28%, 8%)', // Fallback color behind media
        opacity: 1,
      };
    }
    // Default background
    return {
      backgroundColor: bgColor || 'hsl(210, 28%, 8%)',
      opacity: 1,
    };
  };

  const ledColor = primaryColor || defaultStore.primaryColor;
  const textColor = secondaryColor || defaultStore.secondaryColor;
  const displayBackgroundColor = backgroundColor || defaultStore.backgroundColor;

  const [hasCompleted, setHasCompleted] = useState(false);

  const handleComplete = () => {
    setHasCompleted(true);
  };

  const renderCompletionContent = () => {
    if (!hasCompleted) return null;
    
    const compType = completionType || defaultStore.completionType;
    
    if (compType === 'none') {
      return null;
    }
    
    if (compType === 'richText') {
      const message = completionRichText || defaultStore.completionRichText || '🎉 Completed!';
      return (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: ledColor,
            fontSize: `clamp(1.5rem, ${2 * uiScale}rem, 3rem)`,
            fontWeight: 'bold',
            zIndex: 10,
            padding: 'clamp(1.5rem, 3vw, 3rem)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 'clamp(0.5rem, 1vw, 1rem)',
            backdropFilter: 'blur(8px)',
            maxWidth: '90%',
            boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.5)',
            border: `2px solid ${ledColor}40`,
          }}
        >
          {message}
        </div>
      );
    }
    
    if (compType === 'media' && completionMediaId) {
      if (completionMedia?.type === 'video') {
        return (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 10,
            }}
            src={completionMedia.url}
          />
        );
      }
      if (completionMedia?.url) {
        return (
          <img
            src={completionMedia.url}
            alt="Completion media"
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 10,
            }}
          />
        );
      }
    }
    
    return null;
  };

  const currentDisplayStyle = displayStyle || defaultStore.displayStyle;
  
  const renderBackgroundMedia = () => {
    if (backgroundType !== 'media' || !backgroundMedia) return null;
    
    const mediaOpacity = backgroundOpacity !== undefined ? backgroundOpacity : defaultStore.backgroundOpacity;
    
    if (backgroundMedia.type === 'video') {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          src={backgroundMedia.url}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            opacity: mediaOpacity,
            zIndex: 0,
          }}
        />
      );
    }
    return (
      <img
        src={backgroundMedia.url}
        alt="Background"
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          opacity: mediaOpacity,
          zIndex: 0,
        }}
      />
    );
  };

  // Format completion time display
  const getCompletionTimeDisplay = () => {
    const mode = completionTimeMode || defaultStore.completionTimeMode;
    
    if (mode === 'preview') {
      return null; // Don't show in preview mode
    }
    
    if (mode === 'calculated' && targetDateTime) {
      try {
        const date = new Date(targetDateTime);
        const timeString = date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        const dateString = date.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        return `${dateString} at ${timeString}`;
      } catch {
        return null;
      }
    }
    
    if (mode === 'provided' && completionTimeValue) {
      return completionTimeValue;
    }
    
    return null;
  };

  const completionTimeDisplay = getCompletionTimeDisplay();

  return (
    <div 
      className="render-page-container" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        ...getBackgroundStyle(),
      }}
    >
      {renderBackgroundMedia()}
      <div 
        className="render-page-content" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          zIndex: 1,
        }}
      >
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 'clamp(1rem, 3vw, 3rem)',
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '1400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(1rem, 2vw, 2rem)',
            }}
          >
            {/* Title */}
            {titleRichText && (
              <div 
                style={{ 
                  color: textColor,
                  fontSize: `clamp(1.25rem, ${1.6 * uiScale}rem, 2.5rem)`,
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-semibold)',
                  lineHeight: 1.2,
                  maxWidth: '100%',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
              {titleRichText}
            </div>
            )}

            {/* Countdown Timer */}
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              <CountTimer
                key={`countdown-${currentDisplayStyle}-${targetDateTime}`}
                durationMs={countdownDurationMs}
                color={ledColor}
                backgroundColor={displayBackgroundColor}
                height={160 * uiScale}
                scaleFactor={uiScale}
                displayStyle={currentDisplayStyle}
                visibleUnits={visibleUnits}
                unitLabels={unitLabels}
                onComplete={handleComplete}
              />
            </div>

            {/* Call to Action */}
            {ctaRichText && (
              <div 
                style={{ 
                  color: textColor,
                  fontSize: `clamp(1rem, ${1.2 * uiScale}rem, 1.75rem)`,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  maxWidth: '100%',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                }}
              >
                {ctaRichText}
              </div>
            )}

            {/* Completion Time */}
            {completionTimeDisplay && (
              <div 
                style={{ 
                  color: textColor,
                  fontSize: `clamp(0.875rem, ${1 * uiScale}rem, 1.25rem)`,
                  textAlign: 'center',
                  opacity: 0.9,
                  fontWeight: 'var(--font-weight-medium)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Completes: {completionTimeDisplay}
            </div>
            )}
          </div>
        </div>

        {renderCompletionContent()}
      </div>
    </div>
  );
}
