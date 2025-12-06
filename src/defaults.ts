/**
 * @technabit/expo-fancy-ota-updates
 * Default theme and translation values
 */

import type { OTATheme, OTATranslations, OTAVersionData } from './types';

// ============================================================================
// Default Theme (Dark - Indigo accent)
// ============================================================================

export const defaultTheme: OTATheme = {
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    background: '#0B0B0F',
    backgroundSecondary: '#1A1A1F',
    backgroundTertiary: '#2A2A2F',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    border: '#27272A',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  bannerGradient: ['#6366F1', '#818CF8'],
  borderRadius: 16,
  buttonBorderRadius: 20,
  animation: {
    duration: 300,
    pulseDuration: 800,
  },
};

// ============================================================================
// Light Theme Preset
// ============================================================================

export const lightTheme: OTATheme = {
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    background: '#FFFFFF',
    backgroundSecondary: '#F4F4F5',
    backgroundTertiary: '#E4E4E7',
    text: '#18181B',
    textSecondary: '#52525B',
    textTertiary: '#A1A1AA',
    border: '#E4E4E7',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  bannerGradient: ['#6366F1', '#818CF8'],
  borderRadius: 16,
  buttonBorderRadius: 20,
  animation: {
    duration: 300,
    pulseDuration: 800,
  },
};

// ============================================================================
// Default Translations (English)
// ============================================================================

export const defaultTranslations: OTATranslations = {
  banner: {
    updateAvailable: 'New Update Available',
    updateReady: 'Update Ready',
    downloading: 'Downloading update...',
    versionAvailable: 'A new version is available',
    restartToApply: 'Restart to apply changes',
    updateButton: 'Update',
    restartButton: 'Restart',
  },
  infoScreen: {
    title: 'OTA Updates',
    statusTitle: 'Update Status',
    embeddedBuild: 'Embedded Build',
    otaUpdate: 'OTA Update',
    runtimeVersion: 'Runtime Version',
    otaVersion: 'OTA Version',
    releaseDate: 'Release Date',
    updateId: 'Update ID',
    channel: 'Channel',
    whatsNew: "What's New:",
    checkForUpdates: 'Check for Updates',
    downloadUpdate: 'Download Update',
    reloadApp: 'Reload App Now',
    debugTitle: 'Debug Actions',
    simulateUpdate: 'Simulate Update Banner',
    devMode: 'DEV MODE',
    notAvailable: 'N/A',
    none: 'None',
  },
};

// ============================================================================
// Default Version Data
// ============================================================================

export const defaultVersionData: OTAVersionData = {
  version: '0.0.0',
  buildNumber: 0,
  releaseDate: new Date().toISOString(),
  changelog: [],
};

// ============================================================================
// Merge Helpers
// ============================================================================

export function mergeTheme(custom?: Partial<OTATheme>): OTATheme {
  if (!custom) return defaultTheme;
  
  return {
    ...defaultTheme,
    ...custom,
    colors: {
      ...defaultTheme.colors,
      ...custom.colors,
    },
    animation: {
      ...defaultTheme.animation,
      ...custom.animation,
    },
  };
}

export function mergeTranslations(custom?: Partial<OTATranslations>): OTATranslations {
  if (!custom) return defaultTranslations;
  
  return {
    banner: {
      ...defaultTranslations.banner,
      ...custom.banner,
    },
    infoScreen: {
      ...defaultTranslations.infoScreen,
      ...custom.infoScreen,
    },
  };
}
