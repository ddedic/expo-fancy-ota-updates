/**
 * @technabit/expo-fancy-ota-updates
 * OTA Updates Context Provider
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import * as Updates from 'expo-updates';
import * as Device from 'expo-device';
import { AppState, AppStateStatus } from 'react-native';

import type { 
  OTAUpdatesContextValue, 
  OTAUpdatesProviderProps, 
  UpdateStatus,
  OTATheme,
  OTATranslations,
  CheckResult,
} from '../types';
import { 
  mergeTheme, 
  mergeTranslations, 
  defaultVersionData,
} from '../defaults';

// ============================================================================
// Context
// ============================================================================

const OTAUpdatesContext = createContext<OTAUpdatesContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function OTAUpdatesProvider({ 
  children, 
  theme: customTheme, 
  translations: customTranslations,
  config = {},
}: OTAUpdatesProviderProps) {
  const {
    checkOnMount = true,
    checkOnForeground = true,
    minCheckIntervalMs = 0,
    recordSkippedChecks = true,
    autoDownload = false,
    autoReload = false,
    versionData = defaultVersionData,
    debug = __DEV__,
  } = config;

  // Merge theme and translations with defaults
  const theme = useMemo<OTATheme>(() => mergeTheme(customTheme), [customTheme]);
  const translations = useMemo<OTATranslations>(() => mergeTranslations(customTranslations), [customTranslations]);

  // State
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [checkError, setCheckError] = useState<Error | null>(null);
  const [downloadError, setDownloadError] = useState<Error | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [lastSkippedReason, setLastSkippedReason] = useState<string | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const lastCheckRef = useRef<Date | null>(null);

  // Debug logger
  const log = useCallback((message: string, ...args: unknown[]) => {
    if (debug) {
      console.log(`[OTA] ${message}`, ...args);
    }
  }, [debug]);

  const canCheckNow = useCallback((): { allowed: boolean; reason?: string } => {
    if (minCheckIntervalMs <= 0 || !lastCheckRef.current) {
      return { allowed: true };
    }

    const elapsed = Date.now() - lastCheckRef.current.getTime();
    if (elapsed < minCheckIntervalMs) {
      const remaining = minCheckIntervalMs - elapsed;
      return { allowed: false, reason: `Throttled (${remaining}ms remaining)` };
    }

    return { allowed: true };
  }, [minCheckIntervalMs]);

  const recordSkippedResult = useCallback((reason: string): CheckResult => {
    setLastSkippedReason(reason);
    if (recordSkippedChecks) {
      setLastCheck(new Date());
    }
    return { isAvailable: false, status: 'idle', isSkipped: true, reason };
  }, [recordSkippedChecks]);

  // ============================================================================
  // Actions
  // ============================================================================

  const checkForUpdate = useCallback(async (): Promise<CheckResult> => {
    if (__DEV__) {
      log('Skipping update check in DEV mode');
      return recordSkippedResult('DEV mode');
    }

    if (!Device.isDevice) {
      log('Skipping update check in simulator mode');
      return recordSkippedResult('Simulator mode');
    }

    if (!Updates.isEnabled) {
      log('Skipping update check: Updates.isEnabled is false');
      return recordSkippedResult('Updates disabled');
    }

    const throttleResult = canCheckNow();
    if (!throttleResult.allowed) {
      log(`Skipping update check: ${throttleResult.reason}`);
      return recordSkippedResult(throttleResult.reason || 'Throttled');
    }

    try {
      setStatus('checking');
      setCheckError(null);
      setLastSkippedReason(null);
      log('Checking for updates...');
      
      const update = await Updates.checkForUpdateAsync();
      const now = new Date();
      setLastCheck(now);
      lastCheckRef.current = now;

      if (update.isAvailable) {
        log('Update available!');
        setIsUpdateAvailable(true);
        setStatus('available');
        
        if (autoDownload) {
          log('Auto-downloading update...');
          await downloadUpdate();
        }
        return { isAvailable: true, status: 'available', manifest: update.manifest };
      } else {
        log('No update available');
        setIsUpdateAvailable(false);
        setStatus('idle');
        return { isAvailable: false, status: 'idle' };
      }
    } catch (error) {
      console.error('[OTA] Error checking for updates:', error);
      setCheckError(error as Error);
      setStatus('error');
      return { isAvailable: false, status: 'error', error: error as Error };
    }
  }, [autoDownload, canCheckNow, log, recordSkippedResult]);

  const downloadUpdate = useCallback(async () => {
    if (__DEV__) {
      log('Skipping update download in DEV mode');
      return;
    }

    if (!Device.isDevice) {
      log('Skipping update download in simulator mode');
      return;
    }

    if (!Updates.isEnabled) {
      log('Skipping update download: Updates.isEnabled is false');
      return;
    }

    try {
      setStatus('downloading');
      setDownloadError(null);
      log('Downloading update...');
      
      await Updates.fetchUpdateAsync();
      
      log('Update downloaded!');
      setStatus('downloaded');
      
      if (autoReload) {
        log('Auto-reloading app...');
        await reloadApp();
      }
    } catch (error) {
      console.error('[OTA] Error downloading update:', error);
      setDownloadError(error as Error);
      setStatus('error');
    }
  }, [autoReload, log]);

  const reloadApp = useCallback(async () => {
    if (__DEV__) {
      log('Skipping app reload in DEV mode');
      return;
    }

    if (!Device.isDevice) {
      log('Skipping app reload in simulator mode');
      return;
    }

    log('Reloading app...');
    await Updates.reloadAsync();
  }, [log]);

  // Reset simulation state (called when banner is dismissed during simulation)
  const resetSimulation = useCallback(() => {
    log('Resetting simulation state');
    setIsSimulating(false);
    setIsUpdateAvailable(false);
    setStatus('idle');
  }, [log]);

  // Debug function to simulate update banner - real life flow
  const simulateUpdate = useCallback(() => {
    log('Simulating update for debug purposes');
    setIsSimulating(true);
    setIsUpdateAvailable(true);
    setStatus('available');
  }, [log]);

  // ============================================================================
  // Effects
  // ============================================================================

  // Check for updates on mount
  useEffect(() => {
    if (checkOnMount) {
      checkForUpdate();
    }
  }, [checkOnMount, checkForUpdate]);

  // Check for updates when app comes to foreground
  useEffect(() => {
    if (!checkOnForeground) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkForUpdate();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkOnForeground, checkForUpdate]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value = useMemo<OTAUpdatesContextValue>(() => ({
    // State
    isUpdateAvailable,
    isDownloading: status === 'downloading',
    isDownloaded: status === 'downloaded',
    status,
    checkError,
    downloadError,
    lastCheck,
    lastSkippedReason,
    isSimulating,
    
    // expo-updates metadata
    currentUpdateId: (() => {
      if (Updates.updateId) return Updates.updateId;
      const manifestId =
        Updates.manifest && typeof (Updates.manifest as { id?: unknown }).id === 'string'
          ? ((Updates.manifest as { id: string }).id ?? null)
          : null;
      return manifestId;
    })(),
    channel: Updates.channel ?? null,
    runtimeVersion: Updates.runtimeVersion ?? null,
    isEmbeddedUpdate: Updates.isEmbeddedLaunch,
    
    // Version data
    otaVersion: versionData.version,
    otaBuildNumber: versionData.buildNumber,
    otaReleaseDate: versionData.releaseDate,
    otaChangelog: versionData.changelog,
    
    // Actions
    checkForUpdate,
    downloadUpdate,
    reloadApp,
    simulateUpdate,
    resetSimulation,
    
    // Theming & i18n
    theme,
    translations,
  }), [
    isUpdateAvailable,
    status,
    checkError,
    downloadError,
    lastCheck,
    lastSkippedReason,
    isSimulating,
    versionData,
    checkForUpdate,
    downloadUpdate,
    reloadApp,
    simulateUpdate,
    resetSimulation,
    theme,
    translations,
  ]);

  return (
    <OTAUpdatesContext.Provider value={value}>
      {children}
    </OTAUpdatesContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useOTAUpdates(): OTAUpdatesContextValue {
  const context = useContext(OTAUpdatesContext);
  if (context === undefined) {
    throw new Error('useOTAUpdates must be used within an OTAUpdatesProvider');
  }
  return context;
}

// Export context for advanced use cases
export { OTAUpdatesContext };
