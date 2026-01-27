// Export UI components and hooks
export { OTAUpdatesProvider } from './context/OTAUpdatesProvider';
export { useOTAUpdates } from './context/OTAUpdatesProvider';
export { UpdateBanner } from './components/UpdateBanner';
export { 
  OTAInfoScreen,
  OTAUpdateInfo,
  OTAUpdateActions,
  OTAUpdateChangelog 
} from './components/OTAInfoScreen';

// Export types
export type {
  UpdateStatus,
  OTATheme,
  OTATranslations,
  OTAVersionData,
  OTAConfig as OTAProviderConfig,
  OTADismissStorage,
  OTAUpdatesContextValue,
  UpdateBannerProps,
  OTAInfoScreenProps,
} from './types';

// Export defaults
export { defaultTheme, lightTheme, defaultTranslations } from './defaults';

// Export CLI types (for config files)
export type { OTAConfig } from './cli/schema';
