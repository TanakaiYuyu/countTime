import { useUiScaleToSetRem } from '@telemetryos/sdk/react';
import { useMemo, useEffect, useState } from 'react';
import { useCountdownStore } from '../hooks/useCountdownStore';
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

  // CRITICAL: Call useUiScaleToSetRem() to set REM base for responsive scaling
  // Scale adjusts based on viewport resolution
  useUiScaleToSetRem(scaleFactor);

  const {
    targetDateTime,
    primaryColor,
    backgroundType,
    backgroundColor,
    backgroundOpacity,
  } = useCountdownStore();

  // Calculate initial duration in milliseconds from targetDateTime
  const initialDurationMs = useMemo(() => {
    if (!targetDateTime) {
      // Default to 5 minutes if no target date is set
      return 5 * 60 * 1000;
    }
    
    const target = new Date(targetDateTime).getTime();
    const now = Date.now();
    const duration = target - now;
    
    // Return 0 if target is in the past, otherwise return the duration
    return Math.max(0, duration);
  }, [targetDateTime]);

  // Determine background style
  const getBackgroundStyle = () => {
    if (backgroundType === 'solid') {
      return {
        backgroundColor: backgroundColor,
        opacity: backgroundOpacity,
      };
    }
    if (backgroundType === 'media') {
      // Placeholder for media background
      return {
        backgroundColor: '#1a1d2e',
        opacity: backgroundOpacity,
      };
    }
    // Default theme background
    return {
      backgroundColor: 'hsl(210, 28%, 8%)',
      opacity: backgroundOpacity,
    };
  };

  // Use green LED color if primaryColor is available, otherwise use default
  const ledColor = primaryColor && primaryColor !== '#F8B334' ? primaryColor : '#00ff9c';
  const displayBackgroundColor = getBackgroundStyle().backgroundColor || '#000000';

  return (
    <div className="render-page-container" style={getBackgroundStyle()}>
      <div className="render-page-content">
        <CountTimer
          durationMs={initialDurationMs}
          color={ledColor}
          backgroundColor={displayBackgroundColor}
          height={180}
          scaleFactor={scaleFactor}
        />
      </div>
    </div>
  );
}
