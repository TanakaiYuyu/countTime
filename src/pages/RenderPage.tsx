import { media } from '@telemetryos/sdk';
import { useUiAspectRatio, useUiResponsiveFactors, useUiScaleToSetRem } from '@telemetryos/sdk/react';
import { useMemo, useEffect, useState } from 'react';
import { useCountdownStoreContext } from '../hooks/useCountdownStore';
import { defaultStore } from '../store/countdownStore';
import CountTimer from '../components/countdown-styles/CountTimer';

export default function RenderPage() {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  const uiAspectRatio = useUiAspectRatio();

  const scaleFactor = useMemo(() => {
    const designHeight = 900;
    const currentHeight = viewportSize.height;
    const scale = currentHeight / designHeight;
    return Math.max(0.85, Math.min(1.8, scale));
  }, [viewportSize.height]);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useUiScaleToSetRem(scaleFactor);
  useUiResponsiveFactors(scaleFactor, uiAspectRatio);

  // Get all settings from store - useStoreState automatically subscribes to changes
  // This ensures real-time updates when settings change in /settings
  // useStoreState already handles defaults, so we don't need to initialize values
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

  // Log settings when render page loads or settings change
  // useStoreState already handles defaults, so we don't need to initialize
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
    
    // Compare with defaults to see if we're getting saved values or defaults
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

  // Calculate duration - completionDurationMs is already calculated in settings
  const durationMs = useMemo(() => {
    if (typeof completionDurationMs === 'number') {
      return Math.max(0, completionDurationMs);
    }
    // Fallback: calculate from targetDateTime if completionDurationMs isn't set
    if (targetDateTime) {
      const target = new Date(targetDateTime).getTime();
      // eslint-disable-next-line react-hooks/purity -- Intentional: countdown timer needs current time
      return Math.max(0, target - Date.now());
    }
    return defaultStore.completionDurationMs;
  }, [completionDurationMs, targetDateTime]);

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
    const bgOpacity = backgroundOpacity !== undefined ? backgroundOpacity : defaultStore.backgroundOpacity;

    if (bgType === 'solid') {
      return {
        backgroundColor: bgColor,
        opacity: bgOpacity,
      };
    }
    if (bgType === 'media' && backgroundMedia) {
      return {
        backgroundColor: 'transparent',
      };
    }
    return {
      backgroundColor: 'hsl(210, 28%, 8%)',
      opacity: bgOpacity,
    };
  };

  const ledColor = primaryColor || defaultStore.primaryColor;
  const displayBackgroundColor = getBackgroundStyle().backgroundColor || '#000000';

  // Track if countdown has completed
  const [hasCompleted, setHasCompleted] = useState(false);

  // Handle countdown completion
  const handleComplete = () => {
    setHasCompleted(true);
  };

  // Render completion content if timer has completed and completionType is not 'none'
  const renderCompletionContent = () => {
    if (!hasCompleted) return null;
    
    const compType = completionType || defaultStore.completionType;
    
    if (compType === 'none') {
      return null; // Keep showing countdown at 00:00:00
    }
    
    if (compType === 'richText') {
      const message = completionRichText || defaultStore.completionRichText;
      return (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: ledColor,
            fontSize: `${2 * scaleFactor}rem`,
            fontWeight: 'bold',
            zIndex: 10,
            padding: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '0.5rem',
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
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 10 }}
            src={completionMedia.url}
          />
        );
      }
      if (completionMedia?.url) {
        return (
          <img
            src={completionMedia.url}
            alt="Completion media"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 10 }}
          />
        );
      }
    }
    
    return null;
  };

  // Ensure only one display style is used
  const currentDisplayStyle = displayStyle || defaultStore.displayStyle;
  
  console.log('RenderPage - Current displayStyle from store:', displayStyle);
  console.log('RenderPage - Using displayStyle:', currentDisplayStyle);
  console.log('RenderPage - About to render ONE CountTimer component');

  const renderBackgroundMedia = () => {
    if (backgroundType !== 'media' || !backgroundMedia) return null;
    if (backgroundMedia.type === 'video') {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          src={backgroundMedia.url}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: backgroundOpacity }}
        />
      );
    }
    return (
      <img
        src={backgroundMedia.url}
        alt="Background"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: backgroundOpacity }}
      />
    );
  };

  const completionTimeLabel =
    completionTimeMode === 'calculated'
      ? targetDateTime || defaultStore.targetDateTime
      : completionTimeValue || defaultStore.completionTimeValue || '';

  return (
    <div className="render-page-container" style={{ position: 'relative', overflow: 'hidden', ...getBackgroundStyle() }}>
      {renderBackgroundMedia()}
      <div className="render-page-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            <div style={{ marginBottom: '1.25rem', color: secondaryColor || defaultStore.secondaryColor, fontSize: `${1.6 * scaleFactor}rem`, textAlign: 'center' }}>
              {titleRichText}
            </div>
            <CountTimer
              key={`countdown-${currentDisplayStyle}`}
              durationMs={durationMs}
              color={ledColor}
              backgroundColor={displayBackgroundColor}
              height={160 * scaleFactor}
              scaleFactor={scaleFactor}
              displayStyle={currentDisplayStyle}
              visibleUnits={visibleUnits}
              unitLabels={unitLabels}
              onComplete={handleComplete}
            />
            <div style={{ marginTop: '1rem', color: secondaryColor || defaultStore.secondaryColor, fontSize: `${1.2 * scaleFactor}rem`, textAlign: 'center' }}>
              {ctaRichText}
            </div>
            <div style={{ marginTop: '0.75rem', color: secondaryColor || defaultStore.secondaryColor, fontSize: `${1 * scaleFactor}rem`, textAlign: 'center' }}>
              {completionTimeLabel ? `Completion Time: ${completionTimeLabel}` : null}
            </div>
          </div>
        </div>

        {renderCompletionContent()}
      </div>
    </div>
  );
}
