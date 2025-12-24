import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@telemetryos/sdk';
import { CountdownStoreProvider } from './hooks/useCountdownStore';
import { initializeCountdownStore } from './store/countdownStore';
import App from './App.tsx';
import './index.css';

// Configure TelemetryOS SDK - application name must match telemetry.config.json
// For local development, ensure applicationInstance query parameter exists with valid 40-char hash

// Generate a valid 40-character hex hash for local development
const generateDevInstanceId = () => {
  // Create a consistent 40-character hex string for local dev
  // Format: 40 hex characters (like SHA-1 hash)
  const devString = 'dev-local-development-instance-id';
  let hash = '';
  for (let i = 0; hash.length < 40; i++) {
    const char = devString.charCodeAt(i % devString.length);
    hash += char.toString(16).padStart(2, '0');
  }
  // Ensure exactly 40 characters
  return hash.substring(0, 40);
};

// Check current URL parameters
const currentSearch = window.location.search;
const urlParams = new URLSearchParams(currentSearch);
const hasValidInstance = urlParams.has('applicationInstance') && 
  urlParams.get('applicationInstance')?.length === 40;

// Check if we're in local development (not in TelemetryOS Studio)
const hostname = window.location.hostname;
const isPrivateIp =
  /^192\.168\./.test(hostname) ||
  /^10\./.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
const isLocalDev =
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname.includes('localhost') ||
  isPrivateIp;

if (isLocalDev && !hasValidInstance) {
  // For local development, add the parameter and reload to ensure SDK reads it correctly
  urlParams.set('applicationInstance', generateDevInstanceId());
  const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
  // Use replace to avoid adding to history
  window.location.replace(newUrl);
  // This will cause a reload, so code below won't execute
}

// Configure SDK - this will now work in both local dev and TelemetryOS Studio
// Only configure if we have a valid applicationInstance or we're not in local dev
if (!isLocalDev || hasValidInstance) {
  try {
    configure('countdown');
  } catch (error) {
    console.warn('TelemetryOS SDK configuration failed:', error);
    console.info('The app will work but SDK features may be limited.');
  }
}

// Initialize the device-scoped countdown store once per application lifetime.
// Defaults are hydrated only for unset keys.
void initializeCountdownStore().catch((error) => {
  console.warn('Countdown store initialization failed:', error);
});

// Suppress harmless TelemetryOS SDK unsubscribe timeout errors
// These occur when the SDK's internal cleanup tries to unsubscribe from store subscriptions
// They don't affect functionality - the SDK manages subscriptions internally via useStoreState
// Note: These errors are thrown asynchronously, so we catch them via error event listeners
if (typeof window !== 'undefined') {
  // Catch unhandled errors from SDK unsubscribe timeouts
  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    if (message.includes('store.unsubscribe') && message.includes('timed out')) {
      // Prevent these harmless SDK internal errors from appearing in console
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true); // Use capture phase to catch errors early
  
  // Also catch unhandled promise rejections (SDK might throw async errors)
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (message.includes('store.unsubscribe') && message.includes('timed out')) {
      // Prevent these from appearing in console
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CountdownStoreProvider>
      <App />
    </CountdownStoreProvider>
  </StrictMode>
);
