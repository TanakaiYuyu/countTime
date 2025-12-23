/**
 * TelemetryOS Safe Unsubscribe Helper
 * Prevents store.unsubscribe timeout errors by:
 * 1. Checking if subscription exists
 * 2. Handling errors gracefully
 * 3. Optionally retrying
 */

interface SafeUnsubscribeOptions {
  timeout?: number;
  retries?: number;
  delayMs?: number;
}

/**
 * Safely unsubscribes from a TelemetryOS store subscription
 * @param store - The TelemetryOS store instance
 * @param subscriptionName - The name of the subscription to unsubscribe from
 * @param options - Configuration options for the unsubscribe operation
 * @returns Promise<boolean> - True if unsubscribe succeeded, false otherwise
 */
export async function safeUnsubscribe(
  store: any,
  subscriptionName: string,
  options: SafeUnsubscribeOptions = {}
): Promise<boolean> {
  const { timeout = 30000, retries = 1, delayMs = 500 } = options;

  if (!store || typeof store.unsubscribe !== 'function') {
    console.warn('[safeUnsubscribe] Invalid store provided.');
    return false;
  }

  // Check if subscription exists (if the store has this method)
  if (store.hasSubscription && typeof store.hasSubscription === 'function') {
    if (!store.hasSubscription(subscriptionName)) {
      console.warn(`[safeUnsubscribe] Subscription "${subscriptionName}" does not exist.`);
      return false;
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await store.unsubscribe(subscriptionName, { timeout });
      console.log(`[safeUnsubscribe] Successfully unsubscribed "${subscriptionName}".`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(
        `[safeUnsubscribe] Unsubscribe attempt ${attempt + 1} failed for "${subscriptionName}":`,
        errorMessage
      );
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error(
          `[safeUnsubscribe] Failed to unsubscribe "${subscriptionName}" after ${retries + 1} attempts.`
        );
        return false;
      }
    }
  }

  return false;
}

