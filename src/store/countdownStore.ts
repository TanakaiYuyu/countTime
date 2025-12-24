/**
 * TelemetryOS Countdown App - Store Configuration
 * 
 * Defines all store-backed state values for the countdown application.
 * All values are managed via useStoreState from @telemetryos/sdk
 */

export interface CountdownStore {
  // Target Event
  targetDateTime: string | null;
  timezone: string; // IANA timezone or "device"
  
  // Display Configuration
  displayStyle: 'digital' | 'flip' | 'circular' | 'blocks';
  visibleUnits: {
    days: boolean;
    hours: boolean;
    minutes: boolean;
    seconds: boolean;
  };
  unitLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  
  // Messaging
  titleRichText: string;
  ctaRichText: string;
  
  // Completion time (operator provided)
  completionTimeMode: 'calculated' | 'provided' | 'preview';
  completionTimeValue: string | null;

  // Completion
  completionType: 'richText' | 'media' | 'none';
  completionRichText: string;
  completionMediaId: string | null;
  
  // Theme
  primaryColor: string;
  secondaryColor: string;
  
  // Background
  backgroundType: 'default' | 'solid' | 'media';
  backgroundColor: string;
  backgroundMediaId: string | null;
  backgroundOpacity: number; // 0-1
}

/**
 * Default store values
 */
export const defaultStore: CountdownStore = {
  targetDateTime: null,
  timezone: 'device',
  displayStyle: 'flip',
  visibleUnits: {
    days: true,
    hours: true,
    minutes: true,
    seconds: true,
  },
  unitLabels: {
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
  },
  titleRichText: "New Year's Eve Countdown",
  ctaRichText: 'Join us for the celebration!',
  completionTimeMode: 'provided',
  completionTimeValue: null,
  completionType: 'richText',
  completionRichText: 'The countdown has ended!',
  completionMediaId: null,
  primaryColor: '#F8B334',
  secondaryColor: '#C9C1B1',
  backgroundType: 'default',
  backgroundColor: '#1a1d2e',
  backgroundMediaId: null,
  backgroundOpacity: 1,
};

