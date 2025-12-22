import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@telemetryos/sdk';
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
const isLocalDev = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('localhost');

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
