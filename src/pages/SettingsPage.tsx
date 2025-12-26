import { useState, useEffect } from 'react';
import { useCountdownStoreContext } from '../hooks/useCountdownStore';
import { defaultStore } from '../store/countdownStore';
import SettingsHeader from '../components/settings/SettingsHeader';
import TargetEventCard from '../components/settings/TargetEventCard';
import DisplayStyleCard from '../components/settings/DisplayStyleCard';
import TimeUnitsCard from '../components/settings/TimeUnitsCard';
import MessagingCard from '../components/settings/MessagingCard';
import CompletionContentCard from '../components/settings/CompletionContentCard';
import ThemeBackgroundCard from '../components/settings/ThemeBackgroundCard';
import CompletionTimeCard from '../components/settings/CompletionTimeCard';
import RenderPage from './RenderPage';
import { useUiScale } from '../hooks/useUiScale';

/**
 * TelemetryOS Countdown Timer Settings Page
 * 
 * Configuration UI for the countdown timer app with live render preview.
 * All changes update the render preview in real-time via the TelemetryOS SDK store (useStoreState).
 */
export default function SettingsPage() {
  // Use centralized UI scale hook for consistent scaling across the app
  // This automatically applies responsive scaling to rem-based CSS tokens
  const { uiScale, uiAspectRatio, uiWidthFactor, uiHeightFactor, viewport } = useUiScale(1920, 1080);

  // Get all current settings and setters from the shared TelemetryOS store
  const {
    // Current values
    targetDateTime,
    timezone,
    completionDurationMs,
    displayStyle,
    visibleUnits,
    unitLabels,
    titleRichText,
    ctaRichText,
    completionTimeMode,
    completionTimeValue,
    completionType,
    completionRichText,
    completionMediaId,
    primaryColor,
    secondaryColor,
    backgroundType,
    backgroundColor,
    backgroundMediaId,
    backgroundOpacity,
    // Setters
    setTargetDateTime,
    setTimezone,
    setCompletionDurationMs,
    setDisplayStyle,
    setVisibleUnits,
    setUnitLabels,
    setTitleRichText,
    setCtaRichText,
    setCompletionTimeMode,
    setCompletionTimeValue,
    setCompletionType,
    setCompletionRichText,
    setCompletionMediaId,
    setPrimaryColor,
    setSecondaryColor,
    setBackgroundType,
    setBackgroundColor,
    setBackgroundMediaId,
    setBackgroundOpacity,
  } = useCountdownStoreContext();

  // Save message state
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Log initial settings when component mounts or settings change
  useEffect(() => {
    console.log('=== SETTINGS PAGE - CURRENT STORE VALUES ===');
    const allSettings = {
      targetDateTime,
      timezone,
      completionDurationMs,
      displayStyle,
      visibleUnits,
      unitLabels,
      titleRichText,
      ctaRichText,
      completionTimeMode,
      completionTimeValue,
      completionType,
      completionRichText,
      completionMediaId,
      primaryColor,
      secondaryColor,
      backgroundType,
      backgroundColor,
      backgroundMediaId,
      backgroundOpacity,
    };
    console.log('All settings from store (formatted):', JSON.stringify(allSettings, null, 2));
    console.log('Individual values:');
    console.log('  targetDateTime:', targetDateTime);
    console.log('  timezone:', timezone);
    console.log('  displayStyle:', displayStyle);
    console.log('  visibleUnits:', JSON.stringify(visibleUnits, null, 2));
    console.log('  unitLabels:', JSON.stringify(unitLabels, null, 2));
    console.log('  titleRichText:', titleRichText);
    console.log('  ctaRichText:', ctaRichText);
    console.log('  completionTimeMode:', completionTimeMode);
    console.log('  completionTimeValue:', completionTimeValue);
    console.log('  completionType:', completionType);
    console.log('  completionRichText:', completionRichText);
    console.log('  completionMediaId:', completionMediaId);
    console.log('  primaryColor:', primaryColor);
    console.log('  secondaryColor:', secondaryColor);
    console.log('  backgroundType:', backgroundType);
    console.log('  backgroundColor:', backgroundColor);
    console.log('  backgroundMediaId:', backgroundMediaId);
    console.log('  backgroundOpacity:', backgroundOpacity);
    console.log('  completionDurationMs:', completionDurationMs);
  }, [
    targetDateTime,
    timezone,
    displayStyle,
    visibleUnits,
    unitLabels,
    titleRichText,
    ctaRichText,
    completionTimeMode,
    completionTimeValue,
    completionType,
    completionRichText,
    completionMediaId,
    primaryColor,
    secondaryColor,
    backgroundType,
    backgroundColor,
    backgroundMediaId,
    backgroundOpacity,
    completionDurationMs,
  ]);
  
  // Handle save action - explicitly persist all current settings to store
  // This ensures all values are written to the TelemetryOS store and persisted
  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    
    setIsSaving(true);
    try {
      // IMPORTANT: The hook values should reflect what's currently in the store
      // If components called setters when user changed values, those should be in the hook
      // But we'll write them explicitly to ensure persistence
      
      // Collect all current settings from the hook
      // These values come from useStoreState, which should reflect the current store state
      const currentSettings = {
        targetDateTime,
        timezone,
        completionDurationMs,
        displayStyle,
        visibleUnits,
        unitLabels,
        titleRichText,
        ctaRichText,
        completionTimeMode,
        completionTimeValue,
        completionType,
        completionRichText,
        completionMediaId,
        primaryColor,
        secondaryColor,
        backgroundType,
        backgroundColor,
        backgroundMediaId,
        backgroundOpacity,
      };
      
      console.log('=== CURRENT VALUES FROM HOOK ===');
      console.log('Values from hook (currentSettings):', JSON.stringify(currentSettings, null, 2));
      console.log('NOTE: If these are all defaults, it means:');
      console.log('  1. User hasn\'t changed any settings, OR');
      console.log('  2. Store setters from components aren\'t persisting, OR');
      console.log('  3. Hook is returning defaults because store is empty');

      // Log all current settings being saved
      console.log('=== SAVING SETTINGS ===');
      console.log('Current settings from store (formatted):', JSON.stringify(currentSettings, null, 2));
      console.log('Settings breakdown:');
      console.log('  Target Event:');
      console.log('    targetDateTime:', targetDateTime);
      console.log('    timezone:', timezone);
      console.log('    completionDurationMs:', completionDurationMs);
      console.log('  Display Configuration:');
      console.log('    displayStyle:', displayStyle);
      console.log('    visibleUnits:', JSON.stringify(visibleUnits, null, 2));
      console.log('    unitLabels:', JSON.stringify(unitLabels, null, 2));
      console.log('  Messaging:');
      console.log('    titleRichText:', titleRichText);
      console.log('    ctaRichText:', ctaRichText);
      console.log('  Completion Time:');
      console.log('    completionTimeMode:', completionTimeMode);
      console.log('    completionTimeValue:', completionTimeValue);
      console.log('  Completion:');
      console.log('    completionType:', completionType);
      console.log('    completionRichText:', completionRichText);
      console.log('    completionMediaId:', completionMediaId);
      console.log('  Theme:');
      console.log('    primaryColor:', primaryColor);
      console.log('    secondaryColor:', secondaryColor);
      console.log('  Background:');
      console.log('    backgroundType:', backgroundType);
      console.log('    backgroundColor:', backgroundColor);
      console.log('    backgroundMediaId:', backgroundMediaId);
      console.log('    backgroundOpacity:', backgroundOpacity);

      // Explicitly write all current settings to the store
      // Force write each value to ensure they're persisted
      const savedSettings: Record<string, unknown> = {};
      
      console.log('=== WRITING VALUES TO STORE ===');
      
      // Write each value - always write, don't check for undefined
      // This ensures values are explicitly persisted
      console.log('Writing targetDateTime:', targetDateTime);
      setTargetDateTime(targetDateTime);
      savedSettings.targetDateTime = targetDateTime;
      
      console.log('Writing timezone:', timezone);
      setTimezone(timezone);
      savedSettings.timezone = timezone;

      console.log('Writing completionDurationMs:', completionDurationMs);
      setCompletionDurationMs(completionDurationMs);
      savedSettings.completionDurationMs = completionDurationMs;
      
      console.log('Writing displayStyle:', displayStyle);
      setDisplayStyle(displayStyle);
      savedSettings.displayStyle = displayStyle;
      
      console.log('Writing visibleUnits:', visibleUnits);
      setVisibleUnits({ ...visibleUnits }); // Create new object to ensure update
      savedSettings.visibleUnits = visibleUnits;
      
      console.log('Writing unitLabels:', unitLabels);
      setUnitLabels({ ...unitLabels }); // Create new object to ensure update
      savedSettings.unitLabels = unitLabels;
      
      console.log('Writing titleRichText:', titleRichText);
      setTitleRichText(titleRichText);
      savedSettings.titleRichText = titleRichText;
      
      console.log('Writing ctaRichText:', ctaRichText);
      setCtaRichText(ctaRichText);
      savedSettings.ctaRichText = ctaRichText;
      
      console.log('Writing completionType:', completionType);
      setCompletionType(completionType);
      savedSettings.completionType = completionType;
      
      console.log('Writing completionRichText:', completionRichText);
      setCompletionRichText(completionRichText);
      savedSettings.completionRichText = completionRichText;
      
      console.log('Writing completionMediaId:', completionMediaId);
      setCompletionMediaId(completionMediaId);
      savedSettings.completionMediaId = completionMediaId;

      console.log('Writing completionTimeMode:', completionTimeMode);
      setCompletionTimeMode(completionTimeMode);
      savedSettings.completionTimeMode = completionTimeMode;

      console.log('Writing completionTimeValue:', completionTimeValue);
      setCompletionTimeValue(completionTimeValue);
      savedSettings.completionTimeValue = completionTimeValue;
      
      console.log('Writing primaryColor:', primaryColor);
      setPrimaryColor(primaryColor);
      savedSettings.primaryColor = primaryColor;
      
      console.log('Writing secondaryColor:', secondaryColor);
      setSecondaryColor(secondaryColor);
      savedSettings.secondaryColor = secondaryColor;
      
      console.log('Writing backgroundType:', backgroundType);
      setBackgroundType(backgroundType);
      savedSettings.backgroundType = backgroundType;
      
      console.log('Writing backgroundColor:', backgroundColor);
      setBackgroundColor(backgroundColor);
      savedSettings.backgroundColor = backgroundColor;
      
      console.log('Writing backgroundMediaId:', backgroundMediaId);
      setBackgroundMediaId(backgroundMediaId);
      savedSettings.backgroundMediaId = backgroundMediaId;
      
      console.log('Writing backgroundOpacity:', backgroundOpacity);
      setBackgroundOpacity(backgroundOpacity);
      savedSettings.backgroundOpacity = backgroundOpacity;

      // Log what was actually saved
      console.log('Settings written to store (formatted):', JSON.stringify(savedSettings, null, 2));
      console.log('Total settings saved:', Object.keys(savedSettings).length);
      console.log('Settings saved list:', Object.keys(savedSettings));

      // Compare saved values with defaults to see if anything changed
      console.log('=== COMPARING SAVED VALUES WITH DEFAULTS ===');
      const changes: Record<string, { saved: unknown; default: unknown; changed: boolean }> = {};
      Object.keys(savedSettings).forEach((key) => {
        const savedValue = savedSettings[key];
        const defaultValue = (defaultStore as unknown as Record<string, unknown>)[key];
        const changed = JSON.stringify(savedValue) !== JSON.stringify(defaultValue);
        changes[key] = { saved: savedValue, default: defaultValue, changed };
        if (changed) {
          console.log(`  ✓ ${key} CHANGED:`, { from: defaultValue, to: savedValue });
        } else {
          console.log(`  - ${key} unchanged (default):`, savedValue);
        }
      });
      const changedCount = Object.values(changes).filter(c => c.changed).length;
      console.log(`Total changed settings: ${changedCount} out of ${Object.keys(savedSettings).length}`);
      
      // WARNING: If no values changed, the user might not have modified anything
      // OR the store isn't persisting the changes made by individual components
      if (changedCount === 0) {
        console.warn('⚠️ WARNING: No settings differ from defaults!');
        console.warn('This could mean:');
        console.warn('  1. User hasn\'t changed any settings yet');
        console.warn('  2. Store isn\'t persisting changes made by individual components');
        console.warn('  3. Values are being reset to defaults somehow');
        console.warn('Current values being saved:', currentSettings);
      }

      // Small delay to ensure store operations complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Re-read values from store to verify they were actually persisted
      console.log('=== VERIFYING VALUES AFTER SAVE ===');
      // Re-read from the hook to see if values persisted
      // Note: We can't directly re-read here since we're in the same render cycle
      // But we can log what we expect to be in the store
      console.log('Expected values in store after save:');
      Object.entries(savedSettings).forEach(([key, value]) => {
        console.log(`  ${key}:`, value);
      });
      
      console.log('=== SETTINGS SAVE COMPLETE ===');
      console.log('NOTE: Navigate to /render page to verify values are loaded correctly');
      
      // Show success message
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      
      // Notify any open preview windows that settings have been saved
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage({ type: 'SETTINGS_SAVED' }, '*');
          console.log('Notified opener window of settings save');
        } catch (e) {
          console.warn('Could not notify opener window:', e);
        }
      }
      
      // Also broadcast to all windows (for same-origin scenarios)
      window.postMessage({ type: 'SETTINGS_SAVED' }, '*');
      console.log('Broadcasted SETTINGS_SAVED message to all windows');
    } catch (error) {
      console.error('=== ERROR SAVING SETTINGS ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
    console.log("====================================================================================")
  };

  // Handle preview action - render /render inside an in-app modal so it shares the same store instance
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="tos-base settings-page-container">
      {/* Settings Section */}
      <div className="settings-page-content">
        <div className="settings-page-inner">
          <SettingsHeader onSave={handleSave} onPreview={handlePreview} isSaving={isSaving} />
          
          {/* Save success message */}
          {saveMessage && (
            <div
              style={{
                marginBottom: 'var(--space-4)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                animation: 'fadeIn 0.3s ease-in-out',
              }}
            >
              <span>✓</span>
              <span>{saveMessage}</span>
            </div>
          )}
          <div className="settings-grid">
            <TargetEventCard />
            <DisplayStyleCard />
            <TimeUnitsCard />
            <CompletionTimeCard />
            <MessagingCard />
            <CompletionContentCard />
            <ThemeBackgroundCard />
          </div>
          
        </div>
      </div>

      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="preview-modal"
        >
          <div className="preview-modal__content">
            <div className="preview-modal__header">
              <div className="preview-modal__title">Preview</div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="preview-modal__close"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <div className="preview-modal__body">
              <RenderPage />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
