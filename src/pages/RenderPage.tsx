import { useUiScaleToSetRem } from '@telemetryos/sdk/react';
import { useMemo, useEffect, useState } from 'react';
import { useCountdownStore } from '../hooks/useCountdownStore';
import { defaultStore } from '../store/countdownStore';
import CountTimer from '../components/countdown-styles/CountTimer';

export default function RenderPage() {
  // Track viewport dimensions for responsive scaling
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Calculate scale factor based on resolution
  // Base resolution: 1920x1080 (scale = 1.0)
  // Scale down for smaller screens, scale up for larger screens
  const scaleFactor = useMemo(() => {
    const baseWidth = 1920;
    const baseHeight = 1080;
    
    const currentWidth = viewportSize.width;
    const currentHeight = viewportSize.height;
    
    // Calculate scale based on both width and height, prioritizing the smaller dimension
    // to ensure content fits on screen
    const widthScale = currentWidth / baseWidth;
    const heightScale = currentHeight / baseHeight;
    
    // Use the smaller scale to ensure everything fits
    let scale = Math.min(widthScale, heightScale);
    
    // Clamp scale between 0.5 and 2.0 for reasonable bounds
    scale = Math.max(0.5, Math.min(2.0, scale));
    
    return scale;
  }, [viewportSize.width, viewportSize.height]);

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useUiScaleToSetRem(scaleFactor);

  // Get all settings from store - useStoreState automatically subscribes to changes
  // This ensures real-time updates when settings change in /settings
  // useStoreState already handles defaults, so we don't need to initialize values
  const {
    targetDateTime,
    timezone,
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
    completionType,
    completionRichText,
    completionMediaId,
    secondaryColor,
  } = useCountdownStore();

  // Log settings when render page loads or settings change
  // useStoreState already handles defaults, so we don't need to initialize
  useEffect(() => {
    console.log('=== RENDER PAGE - LOADED SETTINGS FROM STORE ===');
    const allSettings = {
      targetDateTime,
      timezone,
      displayStyle,
      visibleUnits,
      unitLabels,
      titleRichText,
      ctaRichText,
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
    console.log('  displayStyle:', displayStyle);
    console.log('  visibleUnits:', JSON.stringify(visibleUnits, null, 2));
    console.log('  unitLabels:', JSON.stringify(unitLabels, null, 2));
    console.log('  titleRichText:', titleRichText);
    console.log('  ctaRichText:', ctaRichText);
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
    completionType,
    completionRichText,
    completionMediaId,
    primaryColor,
    secondaryColor,
    backgroundType,
    backgroundColor,
    backgroundMediaId,
    backgroundOpacity,
  ]);

  // Calculate initial duration in milliseconds from targetDateTime
  const [initialDurationMs, setInitialDurationMs] = useState(() => {
    if (!targetDateTime) {
      return 5 * 60 * 1000;
    }
    const target = new Date(targetDateTime).getTime();
    return Math.max(0, target - (() => Date.now())());
  });

  useEffect(() => {
    if (!targetDateTime) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setInitialDurationMs(5 * 60 * 1000);
      }, 0);
      return;
    }
    
    const target = new Date(targetDateTime).getTime();
    const updateDuration = () => {
      const now = Date.now();
      const duration = target - now;
      setInitialDurationMs(Math.max(0, duration));
    };
    
    // Use setTimeout to avoid calling setState synchronously in effect
    setTimeout(updateDuration, 0);
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  // Determine background style based on store settings
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
    if (bgType === 'media') {
      // Placeholder for media background
      return {
        backgroundColor: '#1a1d2e',
        opacity: bgOpacity,
      };
    }
    // Default theme background
    return {
      backgroundColor: 'hsl(210, 28%, 8%)',
      opacity: bgOpacity,
    };
  };

  // Use primaryColor from store, fallback to default
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
      // Placeholder for media display
      return (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <p style={{ color: ledColor }}>Media ID: {completionMediaId}</p>
        </div>
      );
    }
    
    return null;
  };

  // Ensure only one display style is used
  const currentDisplayStyle = displayStyle || defaultStore.displayStyle;
  
  console.log('RenderPage - Current displayStyle from store:', displayStyle);
  console.log('RenderPage - Using displayStyle:', currentDisplayStyle);
  console.log('RenderPage - About to render ONE CountTimer component');

  return (
    <div className="render-page-container" style={getBackgroundStyle()}>
      <div className="render-page-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
         {/* Countdown timer - Only render ONE timer based on displayStyle */}
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CountTimer
            key={`countdown-${currentDisplayStyle}`}
            durationMs={initialDurationMs}
            color={ledColor}
            backgroundColor={displayBackgroundColor}
            height={180}
            scaleFactor={scaleFactor}
            onComplete={handleComplete}
          />
        </div>

        {/* Completion content overlay */}
        {renderCompletionContent()}
      </div>
    </div>
  );
}
