/**
 * @technabit/expo-fancy-ota-updates
 * OTA Updates Context Provider
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
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
    minCheckIntervalMs = 60_000,
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
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Debug logger
  const log = useCallback((message: string, ...args: unknown[]) => {
    if (debug) {
      console.log(`[OTA] ${message}`, ...args);
    }
  }, [debug]);

  // ============================================================================
  // Actions
  // ============================================================================

  const checkForUpdate = useCallback(async (): Promise<CheckResult> => {
    if (__DEV__) {
      log('Skipping update check in DEV mode');
      return { isAvailable: false, status: 'idle', isSkipped: true, reason: 'DEV mode' };
    }

    if (!Device.isDevice) {
      log('Skipping update check in simulator mode');
      return { isAvailable: false, status: 'idle', isSkipped: true, reason: 'Simulator mode' };
    }

    try {
      setStatus('checking');
      setCheckError(null);
      log('Checking for updates...');
      
      const update = await Updates.checkForUpdateAsync();
      setLastCheck(new Date());

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
  }, [autoDownload, log]);

  const downloadUpdate = useCallback(async () => {
    if (__DEV__) {
      log('Skipping update download in DEV mode');
      return;
    }

    if (!Device.isDevice) {
      log('Skipping update download in simulator mode');
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

  const getThrottleInfo = useCallback(() => {
    if (!minCheckIntervalMs) {
      return { throttled: false, lastCheckIso: null as string | null };
    }
    if (!lastCheck) {
      return { throttled: false, lastCheckIso: null as string | null };
    }
    const elapsed = Date.now() - lastCheck.getTime();
    return {
      throttled: elapsed < minCheckIntervalMs,
      lastCheckIso: lastCheck.toISOString(),
    };
  }, [lastCheck, minCheckIntervalMs]);

  const autoCheckForUpdate = useCallback(async () => {
    const { throttled, lastCheckIso } = getThrottleInfo();

    if (throttled) {
      log(`Skipping auto check (throttled). Last check: ${lastCheckIso}`);
      return;
    }

    await checkForUpdate();
  }, [checkForUpdate, getThrottleInfo, log]);

  // Check for updates on mount
  useEffect(() => {
    if (checkOnMount) {
      autoCheckForUpdate();
    }
  }, [checkOnMount, autoCheckForUpdate]);

  // Check for updates when app comes to foreground
  useEffect(() => {
    if (!checkOnForeground) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        autoCheckForUpdate();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkOnForeground, autoCheckForUpdate]);

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
    isSimulating,
    
    // expo-updates metadata
    currentUpdateId: Updates.updateId ?? null,
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
