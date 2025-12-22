import { useMemo, useEffect, useState } from 'react';
import { useUiScaleToSetRem } from '@telemetryos/sdk/react';
import SettingsHeader from '../components/settings/SettingsHeader';
import TargetEventCard from '../components/settings/TargetEventCard';
import DisplayStyleCard from '../components/settings/DisplayStyleCard';
import TimeUnitsCard from '../components/settings/TimeUnitsCard';
import MessagingCard from '../components/settings/MessagingCard';
import CompletionContentCard from '../components/settings/CompletionContentCard';
import ThemeBackgroundCard from '../components/settings/ThemeBackgroundCard';

/**
 * TelemetryOS Countdown Timer Settings Page
 * 
 * Configuration UI for the countdown timer app. All changes update the render page
 * in real-time via the TelemetryOS SDK store (useStoreState).
 */
export default function SettingsPage() {
  // Track viewport dimensions for responsive scaling
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Calculate scale factor based on resolution
  // Base resolution: 1920x1080 (scale = 1.0)
  const scaleFactor = useMemo(() => {
    const baseWidth = 1920;
    const baseHeight = 1080;
    
    const currentWidth = viewportSize.width;
    const currentHeight = viewportSize.height;
    
    // Calculate scale based on both width and height, prioritizing the smaller dimension
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
  // This ensures all rem-based CSS scales properly for different screen sizes
  useUiScaleToSetRem(scaleFactor);

  return (
    <div className="tos-base min-h-screen">
      <div className="max-w-7xl showcase mx-auto p-6">
        <SettingsHeader />
        <div className="settings-grid">
          <TargetEventCard />
          <DisplayStyleCard />
          <TimeUnitsCard />
          <MessagingCard />
          <CompletionContentCard />
          <ThemeBackgroundCard />
        </div>
      </div>
    </div>
  );
}
