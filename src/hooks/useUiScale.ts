import { useEffect, useMemo, useState } from 'react';
import {
  useUiScaleToSetRem,
  useUiAspectRatio,
  useUiResponsiveFactors,
} from '@telemetryos/sdk/react';

export function useUiScale(designWidth = 1920, designHeight = 1080) {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : designWidth,
    height: typeof window !== 'undefined' ? window.innerHeight : designHeight,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth || designWidth,
        height: window.innerHeight || designHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [designHeight, designWidth]);

  const uiAspectRatio = useUiAspectRatio();

  const uiScale = useMemo(() => {
    const widthScale = viewport.width / designWidth;
    const heightScale = viewport.height / designHeight;
    // Keep scale in a sensible range for stage screens
    return Math.max(0.5, Math.min(2, Math.min(widthScale, heightScale)));
  }, [designHeight, designWidth, viewport.height, viewport.width]);

  const { uiWidthFactor, uiHeightFactor } = useUiResponsiveFactors(
    uiScale,
    uiAspectRatio
  );

  // Apply scale to root rem so all rem-based tokens scale up/down.
  useUiScaleToSetRem(uiScale);

  return {
    uiScale,
    uiAspectRatio,
    uiWidthFactor,
    uiHeightFactor,
    viewport,
  };
}


