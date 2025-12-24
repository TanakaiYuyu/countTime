import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useStoreState } from '@telemetryos/sdk/react';
import {
  defaultStore,
  getCountdownStore,
  getCountdownStoreScope,
  initializeCountdownStore,
} from '../store/countdownStore';
import type { CountdownStore } from '../store/countdownStore';

type CountdownStoreContextValue = {
  // Target Event
  targetDateTime: string | null;
  setTargetDateTime: Dispatch<SetStateAction<string | null>>;
  timezone: string;
  setTimezone: Dispatch<SetStateAction<string>>;
  completionDurationMs: number;
  setCompletionDurationMs: Dispatch<SetStateAction<number>>;

  // Display Configuration
  displayStyle: CountdownStore['displayStyle'];
  setDisplayStyle: Dispatch<SetStateAction<CountdownStore['displayStyle']>>;
  visibleUnits: CountdownStore['visibleUnits'];
  setVisibleUnits: Dispatch<SetStateAction<CountdownStore['visibleUnits']>>;
  unitLabels: CountdownStore['unitLabels'];
  setUnitLabels: Dispatch<SetStateAction<CountdownStore['unitLabels']>>;

  // Completion time
  completionTimeMode: CountdownStore['completionTimeMode'];
  setCompletionTimeMode: Dispatch<SetStateAction<CountdownStore['completionTimeMode']>>;
  completionTimeValue: CountdownStore['completionTimeValue'];
  setCompletionTimeValue: Dispatch<SetStateAction<CountdownStore['completionTimeValue']>>;

  // Messaging
  titleRichText: string;
  setTitleRichText: Dispatch<SetStateAction<string>>;
  ctaRichText: string;
  setCtaRichText: Dispatch<SetStateAction<string>>;

  // Completion
  completionType: CountdownStore['completionType'];
  setCompletionType: Dispatch<SetStateAction<CountdownStore['completionType']>>;
  completionRichText: string;
  setCompletionRichText: Dispatch<SetStateAction<string>>;
  completionMediaId: string | null;
  setCompletionMediaId: Dispatch<SetStateAction<string | null>>;

  // Theme
  primaryColor: string;
  setPrimaryColor: Dispatch<SetStateAction<string>>;
  secondaryColor: string;
  setSecondaryColor: Dispatch<SetStateAction<string>>;

  // Background
  backgroundType: CountdownStore['backgroundType'];
  setBackgroundType: Dispatch<SetStateAction<CountdownStore['backgroundType']>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  backgroundMediaId: string | null;
  setBackgroundMediaId: Dispatch<SetStateAction<string | null>>;
  backgroundOpacity: number;
  setBackgroundOpacity: Dispatch<SetStateAction<number>>;
};

/**
 * Hook to access and update countdown store state.
 * The store lives at the TelemetryOS device scope and is initialized once.
 */
export function useCountdownStore(): CountdownStoreContextValue {
  const deviceStore = useMemo(() => {
    void initializeCountdownStore()
      .then(() => {
        const scope = getCountdownStoreScope();
        if (scope && scope !== 'device') {
          console.warn(`[countdownStore] Using fallback store scope: ${scope}`);
        }
      })
      .catch((err) => {
        console.warn('Failed to initialize countdown store', err);
      });
    return getCountdownStore();
  }, []);

  // Target Event
  const [, targetDateTime, setTargetDateTime] = useStoreState<string | null>(
    deviceStore,
    'targetDateTime',
    defaultStore.targetDateTime
  );
  const [, timezone, setTimezone] = useStoreState<string>(
    deviceStore,
    'timezone',
    defaultStore.timezone
  );
  const [, completionDurationMs, setCompletionDurationMs] = useStoreState<number>(
    deviceStore,
    'completionDurationMs',
    defaultStore.completionDurationMs
  );

  // Display Configuration
  const [, displayStyle, setDisplayStyle] = useStoreState<
    'digital' | 'flip' | 'circular' | 'blocks'
  >(deviceStore, 'displayStyle', defaultStore.displayStyle);

  const [, visibleUnits, setVisibleUnits] = useStoreState<CountdownStore['visibleUnits']>(
    deviceStore,
    'visibleUnits',
    defaultStore.visibleUnits
  );

  const [, unitLabels, setUnitLabels] = useStoreState<CountdownStore['unitLabels']>(
    deviceStore,
    'unitLabels',
    defaultStore.unitLabels
  );

  // Completion time metadata
  const [, completionTimeMode, setCompletionTimeMode] = useStoreState<
    CountdownStore['completionTimeMode']
  >(deviceStore, 'completionTimeMode', defaultStore.completionTimeMode);

  const [, completionTimeValue, setCompletionTimeValue] = useStoreState<
    CountdownStore['completionTimeValue']
  >(deviceStore, 'completionTimeValue', defaultStore.completionTimeValue);

  // Messaging
  const [, titleRichText, setTitleRichText] = useStoreState<string>(
    deviceStore,
    'titleRichText',
    defaultStore.titleRichText
  );

  const [, ctaRichText, setCtaRichText] = useStoreState<string>(
    deviceStore,
    'ctaRichText',
    defaultStore.ctaRichText
  );

  // Completion
  const [, completionType, setCompletionType] = useStoreState<
    'richText' | 'media' | 'none'
  >(deviceStore, 'completionType', defaultStore.completionType);

  const [, completionRichText, setCompletionRichText] = useStoreState<string>(
    deviceStore,
    'completionRichText',
    defaultStore.completionRichText
  );

  const [, completionMediaId, setCompletionMediaId] = useStoreState<string | null>(
    deviceStore,
    'completionMediaId',
    defaultStore.completionMediaId
  );

  // Theme
  const [, primaryColor, setPrimaryColor] = useStoreState<string>(
    deviceStore,
    'primaryColor',
    defaultStore.primaryColor
  );

  const [, secondaryColor, setSecondaryColor] = useStoreState<string>(
    deviceStore,
    'secondaryColor',
    defaultStore.secondaryColor
  );

  // Background
  const [, backgroundType, setBackgroundType] = useStoreState<
    'default' | 'solid' | 'media'
  >(deviceStore, 'backgroundType', defaultStore.backgroundType);

  const [, backgroundColor, setBackgroundColor] = useStoreState<string>(
    deviceStore,
    'backgroundColor',
    defaultStore.backgroundColor
  );

  const [, backgroundMediaId, setBackgroundMediaId] = useStoreState<string | null>(
    deviceStore,
    'backgroundMediaId',
    defaultStore.backgroundMediaId
  );

  const [, backgroundOpacity, setBackgroundOpacity] = useStoreState<number>(
    deviceStore,
    'backgroundOpacity',
    defaultStore.backgroundOpacity
  );

  return {
    // Target Event
    targetDateTime,
    setTargetDateTime,
    timezone,
    setTimezone,
    completionDurationMs,
    setCompletionDurationMs,

    // Display Configuration
    displayStyle,
    setDisplayStyle,
    visibleUnits,
    setVisibleUnits,
    unitLabels,
    setUnitLabels,

    // Completion time
    completionTimeMode,
    setCompletionTimeMode,
    completionTimeValue,
    setCompletionTimeValue,

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

const CountdownStoreContext = createContext<CountdownStoreContextValue | null>(null);

export const CountdownStoreProvider = ({ children }: { children: ReactNode }) => {
  const value = useCountdownStore();
  return createElement(CountdownStoreContext.Provider, { value }, children);
};

export const useCountdownStoreContext = (): CountdownStoreContextValue => {
  const context = useContext(CountdownStoreContext);
  if (!context) {
    throw new Error('useCountdownStoreContext must be used within CountdownStoreProvider');
  }
  return context;
};

