/**
 * @technabit/expo-fancy-ota-updates
 * Type definitions for the OTA updates package
 */

// ============================================================================
// Update Status
// ============================================================================

export type UpdateStatus = 
  | 'idle' 
  | 'checking' 
  | 'available' 
  | 'downloading' 
  | 'downloaded' 
  | 'error';

export interface CheckResult {
  isAvailable: boolean;
  status: UpdateStatus;
  isSkipped?: boolean;
  reason?: string;
  error?: Error;
  manifest?: any;
}

// ============================================================================
// Theme Configuration
// ============================================================================

export interface OTAThemeColors {
  /** Primary brand color (default: #6366F1 - indigo) */
  primary: string;
  /** Lighter shade of primary (default: #818CF8) */
  primaryLight: string;
  /** Background color for cards/containers */
  background: string;
  /** Secondary background (for nested elements) */
  backgroundSecondary: string;
  /** Tertiary background (for deeply nested elements) */
  backgroundTertiary: string;
  /** Primary text color */
  text: string;
  /** Secondary text color */
  textSecondary: string;
  /** Tertiary/muted text color */
  textTertiary: string;
  /** Border color */
  border: string;
  /** Error state color */
  error: string;
  /** Success state color */
  success: string;
  /** Warning state color */
  warning: string;
}

export interface OTATheme {
  colors: OTAThemeColors;
  /** Gradient colors for banner [start, end] */
  bannerGradient?: [string, string];
  /** Border radius for cards and buttons */
  borderRadius?: number;
  /** Border radius for buttons specifically */
  buttonBorderRadius?: number;
  /** Animation configuration */
  animation?: {
    /** Duration for enter/exit animations in ms */
    duration?: number;
    /** Duration for pulse animation in ms */
    pulseDuration?: number;
  };
}

// ============================================================================
// Translations / i18n
// ============================================================================

export interface OTABannerTranslations {
  /** Title when update is available (default: "New Update Available") */
  updateAvailable: string;
  /** Title when update is ready to apply (default: "Update Ready") */
  updateReady: string;
  /** Subtitle while downloading (default: "Downloading update...") */
  downloading: string;
  /** Subtitle showing version - receives version string */
  versionAvailable: string;
  /** Subtitle when ready to restart (default: "Restart to apply changes") */
  restartToApply: string;
  /** Button text to download update (default: "Update") */
  updateButton: string;
  /** Button text to restart app (default: "Restart") */
  restartButton: string;
}

export interface OTAInfoScreenTranslations {
  /** Screen title (default: "OTA Updates") */
  title: string;
  /** Status card title (default: "Update Status") */
  statusTitle: string;
  /** Label for embedded build */
  embeddedBuild: string;
  /** Label for OTA update */
  otaUpdate: string;
  /** Runtime version label */
  runtimeVersion: string;
  /** OTA version label */
  otaVersion: string;
  /** Release date label */
  releaseDate: string;
  /** Update ID label */
  updateId: string;
  /** Channel label */
  channel: string;
  /** Changelog title */
  whatsNew: string;
  /** Check for updates button */
  checkForUpdates: string;
  /** Download update button */
  downloadUpdate: string;
  /** Reload app button */
  reloadApp: string;
  /** Debug section title */
  debugTitle: string;
  /** Simulate update button */
  simulateUpdate: string;
  /** Hide simulation button (when simulating) */
  hideSimulation: string;
  /** DEV mode label */
  devMode: string;
  /** N/A placeholder */
  notAvailable: string;
  /** None placeholder */
  none: string;
}

export interface OTATranslations {
  banner: OTABannerTranslations;
  infoScreen: OTAInfoScreenTranslations;
}

// ============================================================================
// Version Data (from ota-version.json)
// ============================================================================

export interface OTAVersionData {
  /** Semantic version string (e.g., "1.0.0-production.29") */
  version: string;
  /** Incremental build number */
  buildNumber: number;
  /** ISO date string of release */
  releaseDate: string;
  /** Release channel */
  channel?: string;
  /** Array of changelog entries */
  changelog: string[];
}

// ============================================================================
// Provider Configuration
// ============================================================================

export interface OTAConfig {
  /** Check for updates when provider mounts (default: true) */
  checkOnMount?: boolean;
  /** Check for updates when app comes to foreground (default: true) */
  checkOnForeground?: boolean;
  /** Minimum time between automatic checks (mount/foreground) in ms (default: 60000). Set to 0 to disable throttling. Manual checkForUpdate() is not throttled. */
  minCheckIntervalMs?: number;
  /** Automatically download updates when available (default: false) */
  autoDownload?: boolean;
  /** Automatically reload when update is downloaded (default: false) */
  autoReload?: boolean;
  /** Version data from ota-version.json or similar */
  versionData?: OTAVersionData;
  /** Enable debug logging (default: __DEV__) */
  debug?: boolean;
}

// ============================================================================
// Context Value
// ============================================================================

export interface OTAUpdatesContextValue {
  // State
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isDownloaded: boolean;
  status: UpdateStatus;
  checkError: Error | null;
  downloadError: Error | null;
  lastCheck: Date | null;
  /** True when showing a simulated update banner (for testing) */
  isSimulating: boolean;
  
  // expo-updates metadata
  currentUpdateId: string | null;
  channel: string | null;
  runtimeVersion: string | null;
  isEmbeddedUpdate: boolean;
  
  // Version data
  otaVersion: string;
  otaBuildNumber: number;
  otaReleaseDate: string;
  otaChangelog: string[];
  
  // Actions
  checkForUpdate: () => Promise<CheckResult>;
  downloadUpdate: () => Promise<void>;
  reloadApp: () => Promise<void>;
  /** Simulate update banner for testing (shows banner, resets on dismiss) */
  simulateUpdate: () => void;
  /** Reset simulation state (called automatically when banner is dismissed during simulation) */
  resetSimulation: () => void;
  
  // Theming & i18n
  theme: OTATheme;
  translations: OTATranslations;
}

// ============================================================================
// Component Props
// ============================================================================

export interface OTAUpdatesProviderProps {
  children: React.ReactNode;
  /** Theme configuration (merged with defaults) */
  theme?: Partial<OTATheme>;
  /** Translation strings (merged with defaults) */
  translations?: Partial<OTATranslations>;
  /** Provider behavior configuration */
  config?: OTAConfig;
}

export interface UpdateBannerProps {
  /** Override the default banner component */
  renderBanner?: (props: UpdateBannerRenderProps) => React.ReactNode;
  /** Custom style for the container */
  style?: object;
  /** Whether to show the banner (controlled mode) */
  visible?: boolean;
  /** Callback when banner is dismissed */
  onDismiss?: () => void;
}

export interface UpdateBannerRenderProps {
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isDownloaded: boolean;
  otaVersion: string;
  onUpdate: () => void;
  onRestart: () => void;
  onDismiss: () => void;
  theme: OTATheme;
  translations: OTABannerTranslations;
}

export interface RenderInfoProps {
  theme: OTATheme;
  translations: OTATranslations;
  status: UpdateStatus;
  isEmbeddedUpdate: boolean;
  runtimeVersion: string | null;
  otaVersion: string;
  otaBuildNumber: number;
  otaReleaseDate: string;
  currentUpdateId: string | null;
  channel: string | null;
  isUpdateAvailable: boolean;
}

export interface RenderActionsProps {
  theme: OTATheme;
  translations: OTATranslations;
  status: UpdateStatus;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  isDownloaded: boolean;
  isSimulating: boolean;
  checkForUpdate: () => Promise<CheckResult>;
  downloadUpdate: () => Promise<void>;
  reloadApp: () => Promise<void>;
  simulateUpdate: () => void;
  resetSimulation: () => void;
}

export interface RenderChangelogProps {
  theme: OTATheme;
  translations: OTATranslations;
  otaChangelog: string[];
}

export interface OTAInfoScreenProps {
  /** Custom header render function */
  renderHeader?: (props: { theme: OTATheme; onBack?: () => void }) => React.ReactNode;
  /** Callback for back navigation */
  onBack?: () => void;
  /** Custom style for the container */
  style?: object;
  
  /** Custom render function for the base info section (Status + Version Info) */
  renderInfo?: (props: RenderInfoProps) => React.ReactNode;
  /** Custom render function for the actions section (Buttons + Debug) */
  renderActions?: (props: RenderActionsProps) => React.ReactNode;
  /** Custom render function for the changelog section */
  renderChangelog?: (props: RenderChangelogProps) => React.ReactNode;
  
  // Mode configuration
  /** 
   * Screen mode: 'developer' shows all debug features, 'user' shows clean production UI
   * @default 'developer'
   */
  mode?: 'developer' | 'user';
  
  // Visibility configuration (all default to true, but mode affects defaults)
  /** Show runtime version info */
  showRuntimeVersion?: boolean;
  /** Show OTA version and build number */
  showOtaVersion?: boolean;
  /** Show release date */
  showReleaseDate?: boolean;
  /** Show update ID (truncated) */
  showUpdateId?: boolean;
  /** Show channel info in header */
  showChannel?: boolean;
  /** Show changelog/what's new section */
  showChangelog?: boolean;
  /** Show "Check for Updates" button */
  showCheckButton?: boolean;
  /** Show "Download Update" button when update available */
  showDownloadButton?: boolean;
  /** Show "Reload App" button when update downloaded */
  showReloadButton?: boolean;
  /** Show debug section with simulate button */
  showDebugSection?: boolean;
  
  /** @deprecated Use mode='user' or showDebugSection={false} instead */
  hideDebug?: boolean;
}
