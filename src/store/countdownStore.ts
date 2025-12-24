import { store } from '@telemetryos/sdk';
import type { StoreSlice } from '@telemetryos/root-sdk';

/**
 * TelemetryOS Countdown App - Store Configuration
 *
 * Device-level store state for all operator-controlled settings.
 * This module owns the single TelemetryOS store slice used across
 * both /settings and /render.
 */

export interface CountdownStore {
  // Target Event
  targetDateTime: string | null;
  timezone: string; // IANA timezone or "device"
  completionDurationMs: number;

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
 * Default store values (applied once when the SDK store is created).
 * Defaults represent an idle, signage-safe baseline — no transient/demo data.
 */
export const defaultStore: CountdownStore = {
  targetDateTime: null,
  timezone: 'device',
  completionDurationMs: 0,
  displayStyle: 'digital',
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
  titleRichText: '',
  ctaRichText: '',
  completionTimeMode: 'provided',
  completionTimeValue: null,
  completionType: 'none',
  completionRichText: '',
  completionMediaId: null,
  primaryColor: '#f1f5f9',
  secondaryColor: '#cbd5e1',
  backgroundType: 'default',
  backgroundColor: '#0b0d17',
  backgroundMediaId: null,
  backgroundOpacity: 1,
};

type StoreHandler<T> = (value: T | undefined) => void;

class InMemoryStoreSlice {
  private data = new Map<string, unknown>();
  private listeners = new Map<string, Set<StoreHandler<unknown>>>();

  async set<T>(key: string, value: T): Promise<boolean> {
    this.data.set(key, value);
    this.emit(key, value);
    return true;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.data.get(key) as T | undefined;
  }

  async subscribe<T>(key: string, handler: StoreHandler<T | undefined>): Promise<boolean> {
    const bucket = this.listeners.get(key) ?? new Set();
    bucket.add(handler as StoreHandler<unknown>);
    this.listeners.set(key, bucket);
    // Emit current value immediately for parity with SDK behavior
    handler((await this.get<T>(key)) as T | undefined);
    return true;
  }

  async unsubscribe<T>(key: string, handler?: StoreHandler<T | undefined>): Promise<boolean> {
    if (!handler) {
      this.listeners.delete(key);
      return true;
    }
    const bucket = this.listeners.get(key);
    if (bucket) {
      bucket.delete(handler as StoreHandler<unknown>);
      if (bucket.size === 0) {
        this.listeners.delete(key);
      }
    }
    return true;
  }

  async delete(key: string): Promise<boolean> {
    this.data.delete(key);
    this.emit(key, undefined);
    return true;
  }

  private emit(key: string, value: unknown) {
    const bucket = this.listeners.get(key);
    if (!bucket) return;
    bucket.forEach((handler) => {
      try {
        handler(value);
      } catch (err) {
        // Swallow listener errors to avoid breaking others
        console.warn('[countdownStore] In-memory listener error', err);
      }
    });
  }
}

let countdownStoreSlice: StoreSlice | InMemoryStoreSlice | null = null;
let initializationPromise: Promise<StoreSlice | InMemoryStoreSlice> | null = null;
let resolvedScope: 'device' | 'instance' | 'memory' | null = null;

const resolveStoreSlice = async (): Promise<StoreSlice | InMemoryStoreSlice> => {
  if (countdownStoreSlice) return countdownStoreSlice;

  const sdkStore = store();
  const deviceSlice = sdkStore.device;
  const instanceSlice = sdkStore.instance;

  // Try device
  try {
    await deviceSlice.set('__countdown_store_healthcheck', '__ok');
    await deviceSlice.delete('__countdown_store_healthcheck');
    countdownStoreSlice = deviceSlice;
    resolvedScope = 'device';
    return countdownStoreSlice;
  } catch (err) {
    console.warn('[countdownStore] Device scope unavailable, trying instance scope.', err);
  }

  // Try instance
  try {
    await instanceSlice.set('__countdown_store_healthcheck', '__ok');
    await instanceSlice.delete('__countdown_store_healthcheck');
    countdownStoreSlice = instanceSlice;
    resolvedScope = 'instance';
    return countdownStoreSlice;
  } catch (err) {
    console.warn('[countdownStore] Instance scope unavailable, falling back to in-memory store.', err);
  }

  // Fallback to in-memory to keep UI functional in dev when bridge is absent
  countdownStoreSlice = new InMemoryStoreSlice();
  resolvedScope = 'memory';
  console.warn('[countdownStore] Using in-memory store fallback; data will not persist across reloads.');
  return countdownStoreSlice;
};

const applyDefaultsOnce = async (slice: StoreSlice | InMemoryStoreSlice) => {
  await Promise.all(
    Object.entries(defaultStore).map(async ([key, value]) => {
      try {
        const existing = await slice.get(key);
        if (typeof existing === 'undefined') {
          await slice.set(key, value as never);
        }
      } catch (err) {
        console.warn(`[countdownStore] Failed to apply default for ${key}`, err);
      }
    })
  );
};

/**
 * Initialize the TelemetryOS device store exactly once and hydrate defaults
 * for unset keys. Safe to call multiple times.
 */
export const initializeCountdownStore = (): Promise<StoreSlice | InMemoryStoreSlice> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const slice = await resolveStoreSlice();
    await applyDefaultsOnce(slice);
    return slice;
  })().catch((err) => {
    initializationPromise = null;
    throw err;
  });

  return initializationPromise;
};

/**
 * Return the singleton device store slice. This does not recreate the store
 * and kicks off default hydration if it has not already run.
 */
export const getCountdownStore = (): StoreSlice | InMemoryStoreSlice => {
  if (!countdownStoreSlice) {
    // Start async resolution but return instance scope as a safe fallback immediately.
    void resolveStoreSlice()
      .then((slice) => applyDefaultsOnce(slice))
      .catch((err) => console.warn('[countdownStore] Failed to resolve store slice', err));
    countdownStoreSlice = new InMemoryStoreSlice();
    resolvedScope = resolvedScope ?? 'memory';
  }
  return countdownStoreSlice;
};

export const getCountdownStoreScope = () => resolvedScope;

