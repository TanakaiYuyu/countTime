/**
 * Custom hook for accessing countdown store state
 * Uses TelemetryOS SDK's useStoreState hook
 */

import { useMemo } from 'react';
import { useStoreState } from '@telemetryos/sdk/react';
import { store } from '@telemetryos/sdk';
import type { CountdownStore } from '../store/countdownStore';
import { defaultStore } from '../store/countdownStore';

/**
 * Hook to access and update countdown store state
 * All state is stored in SDK's local scope (shared between settings and render)
 */
export function useCountdownStore() {
  // Memoize the store instance to prevent creating new subscriptions on every render
  const instanceStore = useMemo(() => store().instance, []);

  // Target Event
  const [, targetDateTime, setTargetDateTime] = useStoreState<string | null>(
    instanceStore,
    'targetDateTime',
    defaultStore.targetDateTime
  );
  const [, timezone, setTimezone] = useStoreState<string>(
    instanceStore,
    'timezone',
    defaultStore.timezone
  );

  // Display Configuration
  const [, displayStyle, setDisplayStyle] = useStoreState<
    'digital' | 'flip' | 'circular' | 'blocks'
  >(instanceStore, 'displayStyle', defaultStore.displayStyle);

  const [, visibleUnits, setVisibleUnits] = useStoreState<CountdownStore['visibleUnits']>(
    instanceStore,
    'visibleUnits',
    defaultStore.visibleUnits
  );

  const [, unitLabels, setUnitLabels] = useStoreState<CountdownStore['unitLabels']>(
    instanceStore,
    'unitLabels',
    defaultStore.unitLabels
  );

  // Messaging
  const [, titleRichText, setTitleRichText] = useStoreState<string>(
    instanceStore,
    'titleRichText',
    defaultStore.titleRichText
  );

  const [, ctaRichText, setCtaRichText] = useStoreState<string>(
    instanceStore,
    'ctaRichText',
    defaultStore.ctaRichText
  );

  // Completion
  const [, completionType, setCompletionType] = useStoreState<
    'richText' | 'media' | 'none'
  >(instanceStore, 'completionType', defaultStore.completionType);

  const [, completionRichText, setCompletionRichText] = useStoreState<string>(
    instanceStore,
    'completionRichText',
    defaultStore.completionRichText
  );

  const [, completionMediaId, setCompletionMediaId] = useStoreState<string | null>(
    instanceStore,
    'completionMediaId',
    defaultStore.completionMediaId
  );

  // Theme
  const [, primaryColor, setPrimaryColor] = useStoreState<string>(
    instanceStore,
    'primaryColor',
    defaultStore.primaryColor
  );

  const [, secondaryColor, setSecondaryColor] = useStoreState<string>(
    instanceStore,
    'secondaryColor',
    defaultStore.secondaryColor
  );

  // Background
  const [, backgroundType, setBackgroundType] = useStoreState<
    'default' | 'solid' | 'media'
  >(instanceStore, 'backgroundType', defaultStore.backgroundType);

  const [, backgroundColor, setBackgroundColor] = useStoreState<string>(
    instanceStore,
    'backgroundColor',
    defaultStore.backgroundColor
  );

  const [, backgroundMediaId, setBackgroundMediaId] = useStoreState<string | null>(
    instanceStore,
    'backgroundMediaId',
    defaultStore.backgroundMediaId
  );

  const [, backgroundOpacity, setBackgroundOpacity] = useStoreState<number>(
    instanceStore,
    'backgroundOpacity',
    defaultStore.backgroundOpacity
  );

  // Note: We do NOT unsubscribe on component unmount because:
  // 1. The TelemetryOS SDK store persists data across component mounts/unmounts
  // 2. Multiple components (SettingsPage, RenderPage) share the same store instance
  // 3. Unsubscribing would cause data loss when navigating between pages
  // 4. The SDK manages subscription lifecycle internally via useStoreState
  // The store instance and subscriptions persist for the lifetime of the application instance

  return {
    // Target Event
    targetDateTime,
    setTargetDateTime,
    timezone,
    setTimezone,

    // Display Configuration
    displayStyle,
    setDisplayStyle,
    visibleUnits,
    setVisibleUnits,
    unitLabels,
    setUnitLabels,

    // Messaging
    titleRichText,
    setTitleRichText,
    ctaRichText,
    setCtaRichText,

    // Completion
    completionType,
    setCompletionType,
    completionRichText,
    setCompletionRichText,
    completionMediaId,
    setCompletionMediaId,

    // Theme
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,

    // Background
    backgroundType,
    setBackgroundType,
    backgroundColor,
    setBackgroundColor,
    backgroundMediaId,
    setBackgroundMediaId,
    backgroundOpacity,
    setBackgroundOpacity,
  };
}

