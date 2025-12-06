/**
 * @technabit/expo-fancy-ota-updates
 * Public API Exports
 */

// Context & Hooks
export { OTAUpdatesProvider, useOTAUpdates, OTAUpdatesContext } from './context/OTAUpdatesProvider';

// Components
export { UpdateBanner } from './components/UpdateBanner';
export { OTAInfoScreen } from './components/OTAInfoScreen';

// Defaults (for customization)
export { 
  defaultTheme, 
  lightTheme, 
  defaultTranslations,
  defaultVersionData,
  mergeTheme,
  mergeTranslations,
} from './defaults';

// Types
export type {
  // Core types
  UpdateStatus,
  OTATheme,
  OTAThemeColors,
  OTATranslations,
  OTABannerTranslations,
  OTAInfoScreenTranslations,
  OTAVersionData,
  OTAConfig,
  OTAUpdatesContextValue,
  
  // Component props
  OTAUpdatesProviderProps,
  UpdateBannerProps,
  UpdateBannerRenderProps,
  OTAInfoScreenProps,
} from './types';
