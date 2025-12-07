# @ddedic/expo-fancy-ota-updates

A highly customizable OTA (Over-The-Air) update UI package for Expo apps. Includes animated banners, info screens, and full theming support.


[![npm version](https://img.shields.io/npm/v/@ddedic/expo-fancy-ota-updates.svg)](https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-vitepress-blue.svg)](https://ddedic.github.io/expo-fancy-ota-updates/)

**[📚 Full Documentation](https://ddedic.github.io/expo-fancy-ota-updates/)** | **[📦 npm Package](https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates)** | **[💻 GitHub](https://github.com/ddedic/expo-fancy-ota-updates)**


---

<div align="center">

### 🏆 Proudly Used In

<a href="https://www.photo-trim.com">
  <img src="./assets/photo-trim-icon.png" alt="Photo Trim" width="80" height="80" style="border-radius: 16px;" />
</a>

## **[Photo Trim — Smart Photo Library Cleaner](https://www.photo-trim.com)**

*See exactly what's eating your storage — and fix it in seconds*

**Photo Trim** gives you complete visibility into your photo library clutter. Discover large files, old media, and forgotten videos buried in both your device and iCloud. Smart grouping and powerful filters make it effortless to identify and delete unnecessary photos and videos — reclaiming gigabytes of storage with just a few taps.

<table>
<tr>
<td align="center">📊<br/><b>Storage Insights</b><br/><sub>See what's cluttering device & iCloud</sub></td>
<td align="center">�<br/><b>Sort by Size</b><br/><sub>Find large photos & videos instantly</sub></td>
<td align="center">☁️<br/><b>iCloud vs Device</b><br/><sub>Clear visibility of where files live</sub></td>
</tr>
<tr>
<td align="center">�<br/><b>Filter by Date</b><br/><sub>Target old, forgotten media</sub></td>
<td align="center">�️<br/><b>Batch Delete</b><br/><sub>Clean up hundreds in one tap</sub></td>
<td align="center">🔒<br/><b>Privacy First</b><br/><sub>All analysis stays on your device</sub></td>
</tr>
</table>

**[🌐 Visit photo-trim.com](https://www.photo-trim.com)** · **[📱 Download on App Store](https://apps.apple.com/app/photo-trim)**

</div>

---

## ✨ Features

### UI Components

- 🎨 **Fully Customizable** — Theme colors, gradients, border radius, and animations
- 🌍 **i18n Ready** — Pass your own translations or use English defaults
- ✨ **Animated Banner** — Beautiful gradient banner with pulse animation
- 📱 **Info Screen** — Full debug/info screen with changelog display
- 🔌 **Drop-in Ready** — Works out of the box with sensible defaults
- 🎯 **Render Props** — Override any component with your own implementation
- 🎨 **Icon Support** — Uses lucide-react-native with text fallbacks

### CLI Publishing Tool

- 🚀 **Easy Publishing** — Simple `ota-publish` command to publish OTA updates
- ⚙️ **Configurable** — Customize via `ota-updates.config.js`
- 📊 **Multiple Version Strategies** — Semver, build number, or date-based
- 📝 **Smart Changelog** — Auto-generate from git, manual input, or file
- 🎯 **Interactive Mode** — Guided prompts for easy publishing
- 🔍 **Dry Run** — Preview changes before publishing
- 🪝 **Hooks System** — Run custom logic before/after publish
- 📦 **Multi-Channel** — Support for dev, preview, production channels

---

## 📸 Screenshots

<div align="center">

### UI Components in Action

<table>
<tr>
<td width="33%" align="center">
  <img src="./assets/screenshots/screenshot-1.PNG" alt="Update Banner" width="100%" />
  <br/>
  <sub><b>Animated Update Banner</b></sub>
  <br/>
  <sub>Beautiful gradient with pulse animation</sub>
</td>
<td width="33%" align="center">
  <img src="./assets/screenshots/screenshot-2.PNG" alt="Download Progress" width="100%" />
  <br/>
  <sub><b>Download Progress</b></sub>
  <br/>
  <sub>Real-time download status</sub>
</td>
<td width="33%" align="center">
  <img src="./assets/screenshots/screenshot-3.PNG" alt="OTA Info Screen" width="100%" />
  <br/>
  <sub><b>OTA Info Screen</b></sub>
  <br/>
  <sub>Full debug & version details</sub>
</td>
</tr>
</table>

### CLI Publishing Tool

<img src="./assets/screenshots/cli-screenshot.png" alt="CLI Tool" width="80%" />

<sub><b>Interactive CLI</b> — Publish OTA updates with guided prompts, version tracking, and changelog generation</sub>

</div>

---

## 📦 Installation

```bash
# Using bun
bun add @ddedic/expo-fancy-ota-updates

# Using npm
npm install @ddedic/expo-fancy-ota-updates

# Using yarn
yarn add @ddedic/expo-fancy-ota-updates
```

### Peer Dependencies

The following dependencies are required:

```bash
bun add expo expo-updates expo-device react react-native react-native-reanimated react-native-safe-area-context
```

Optional dependencies for enhanced visuals:

```bash
# For gradient banners
bun add expo-linear-gradient

# For beautiful icons (recommended)
bun add lucide-react-native react-native-svg
```

---

## 🚀 Quick Start

### 1. Create Version File

Create an `ota-version.json` file in your project root (this gets updated by your OTA publishing workflow):

```json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "releaseDate": "2025-01-01T00:00:00.000Z",
  "changelog": ["Initial release"]
}
```

### 2. Wrap Your App

```tsx
// App.tsx or _layout.tsx
import { 
  OTAUpdatesProvider, 
  UpdateBanner 
} from '@ddedic/expo-fancy-ota-updates';
import versionData from './ota-version.json';

export default function App() {
  return (
    <OTAUpdatesProvider config={{ versionData }}>
      {/* Banner auto-shows when update is available */}
      <UpdateBanner />
      
      {/* Your app content */}
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

That's it! The banner will automatically appear when an OTA update is detected.

---

## 📚 Documentation

**[📖 View Full Documentation →](https://ddedic.github.io/expo-fancy-ota-updates/)**

Comprehensive documentation with guides, examples, and API reference:

- **[Getting Started](https://ddedic.github.io/expo-fancy-ota-updates/getting-started)** — Quick setup guide
- **[UI Components](https://ddedic.github.io/expo-fancy-ota-updates/ui-components/provider)** — Provider, Banner, Info Screen, Hook
- **[CLI Tool](https://ddedic.github.io/expo-fancy-ota-updates/cli/overview)** — Publishing commands and configuration
- **[Guides](https://ddedic.github.io/expo-fancy-ota-updates/guides/theming)** — Theming, i18n, Hooks
- **[Examples](https://ddedic.github.io/expo-fancy-ota-updates/examples/workflow)** — Complete workflows and custom UI

---

## 🚀 CLI Publishing Tool

This package includes a powerful CLI for publishing OTA updates with version tracking.

### Quick Start

```bash
# Initialize config
npx ota-publish init

# Publish update
npx ota-publish --channel production
```

### Using in Your App

**After publishing to npm:**
```bash
npx ota-publish --channel development
```

**For local development (before npm publish):**

Add to your `package.json`:
```json
{
  "scripts": {
    "ota:dev": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel development",
    "ota:preview": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel preview",
    "ota:prod": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel production"
  }
}
```

Then run: `npm run ota:dev`, `npm run ota:preview`, or `npm run ota:prod`

**📖 [Full CLI Documentation →](./CLI.md)**

---

## 📖 API Reference

### `<OTAUpdatesProvider>`

The main provider that enables OTA update functionality throughout your app.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Your app content |
| `theme` | `Partial<OTATheme>` | Custom theme (merged with defaults) |
| `translations` | `Partial<OTATranslations>` | Custom translations (merged with defaults) |
| `config` | `OTAConfig` | Provider behavior configuration |

#### Config Options

```typescript
interface OTAConfig {
  checkOnMount?: boolean;      // Check for updates on mount (default: true)
  checkOnForeground?: boolean; // Check when app comes to foreground (default: true)
  autoDownload?: boolean;      // Auto-download when available (default: false)
  autoReload?: boolean;        // Auto-reload after download (default: false)
  versionData?: OTAVersionData; // Version info from ota-version.json
  debug?: boolean;             // Enable debug logging (default: __DEV__)
}
```

#### Full Example

```tsx
<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#6366F1',
      primaryLight: '#818CF8',
      background: '#0B0B0F',
      text: '#FFFFFF',
    },
    bannerGradient: ['#6366F1', '#818CF8'],
    borderRadius: 16,
  }}
  translations={{
    banner: {
      updateAvailable: 'New Update Available!',
      updateButton: 'Update Now',
    },
  }}
  config={{
    checkOnMount: true,
    checkOnForeground: true,
    autoDownload: false,
    versionData: require('./ota-version.json'),
  }}
>
  {children}
</OTAUpdatesProvider>
```

---

### `useOTAUpdates()` Hook

Access OTA update state and actions from any component within the provider.

```tsx
import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

function MyComponent() {
  const {
    // State
    isUpdateAvailable,  // boolean - Update is available to download
    isDownloading,      // boolean - Currently downloading
    isDownloaded,       // boolean - Download complete, ready to apply
    status,             // 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error'
    checkError,         // Error | null
    downloadError,      // Error | null
    lastCheck,          // Date | null
    
    // expo-updates Metadata
    currentUpdateId,    // string | null
    channel,            // string | null
    runtimeVersion,     // string | null
    isEmbeddedUpdate,   // boolean
    
    // Version Data
    otaVersion,         // string - e.g., "1.0.0-production.29"
    otaBuildNumber,     // number
    otaReleaseDate,     // string - ISO date
    otaChangelog,       // string[]
    
    // Actions
    checkForUpdate,     // () => Promise<void>
    downloadUpdate,     // () => Promise<void>
    reloadApp,          // () => Promise<void>
    simulateUpdate,     // () => void - For testing
    
    // Theming
    theme,              // OTATheme
    translations,       // OTATranslations
  } = useOTAUpdates();
}
```

---

### `<UpdateBanner>`

Animated banner that appears when updates are available.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `style` | `object` | Custom container style |
| `visible` | `boolean` | Controlled visibility mode |
| `onDismiss` | `() => void` | Called when banner is dismissed |
| `renderBanner` | `(props) => ReactNode` | Custom render function |

#### Basic Usage

```tsx
// Auto-shows when update available
<UpdateBanner />
```

#### Controlled Mode

```tsx
const [showBanner, setShowBanner] = useState(false);

<UpdateBanner 
  visible={showBanner} 
  onDismiss={() => setShowBanner(false)} 
/>
```

#### Custom Render

```tsx
<UpdateBanner
  renderBanner={({ 
    isDownloaded, 
    isDownloading,
    otaVersion,
    onUpdate, 
    onRestart, 
    onDismiss,
    theme 
  }) => (
    <View style={{ backgroundColor: theme.colors.primary }}>
      <Text>{isDownloaded ? 'Ready!' : `v${otaVersion} available`}</Text>
      <Button 
        title={isDownloaded ? 'Restart' : 'Update'} 
        onPress={isDownloaded ? onRestart : onUpdate} 
      />
      <Button title="Later" onPress={onDismiss} />
    </View>
  )}
/>
```

---

### `<OTAInfoScreen>`

Full debug/info screen for OTA updates. Great for settings or debug menus.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `onBack` | `() => void` | Back navigation callback |
| `hideDebug` | `boolean` | Hide debug section (default: false) |
| `style` | `object` | Custom container style |
| `renderHeader` | `(props) => ReactNode` | Custom header render |

#### Usage

```tsx
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';

// In your settings or debug screen
<OTAInfoScreen 
  onBack={() => navigation.goBack()} 
  hideDebug={!__DEV__}
/>
```

---

## 🎨 Theming

### Theme Structure

```typescript
interface OTATheme {
  colors: {
    primary: string;           // Main brand color
    primaryLight: string;      // Lighter variant
    background: string;        // Screen background
    backgroundSecondary: string;
    backgroundTertiary: string;
    text: string;              // Primary text
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  bannerGradient?: [string, string];  // Gradient start/end
  borderRadius?: number;               // Card border radius
  buttonBorderRadius?: number;         // Button border radius
  animation?: {
    duration?: number;       // Enter/exit animation (ms)
    pulseDuration?: number;  // Pulse animation cycle (ms)
  };
}
```

### Using Built-in Themes

```tsx
import { 
  OTAUpdatesProvider, 
  defaultTheme,  // Dark indigo theme
  lightTheme,    // Light theme
} from '@ddedic/expo-fancy-ota-updates';

// Use light theme
<OTAUpdatesProvider theme={lightTheme}>

// Or customize from defaults
<OTAUpdatesProvider theme={{
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#10B981',
  },
}}>
```

---

## 🌍 Translations

### Translation Structure

```typescript
interface OTATranslations {
  banner: {
    updateAvailable: string;
    updateReady: string;
    downloading: string;
    versionAvailable: string;
    restartToApply: string;
    updateButton: string;
    restartButton: string;
  };
  infoScreen: {
    title: string;
    statusTitle: string;
    embeddedBuild: string;
    otaUpdate: string;
    runtimeVersion: string;
    otaVersion: string;
    releaseDate: string;
    updateId: string;
    channel: string;
    whatsNew: string;
    checkForUpdates: string;
    downloadUpdate: string;
    reloadApp: string;
    debugTitle: string;
    simulateUpdate: string;
    devMode: string;
    notAvailable: string;
    none: string;
  };
}
```

### German Example

```tsx
<OTAUpdatesProvider
  translations={{
    banner: {
      updateAvailable: 'Neue Version verfügbar',
      updateReady: 'Update bereit',
      downloading: 'Download läuft...',
      versionAvailable: 'Eine neue Version ist verfügbar',
      restartToApply: 'Neustart zum Anwenden',
      updateButton: 'Aktualisieren',
      restartButton: 'Neustart',
    },
    infoScreen: {
      title: 'OTA Updates',
      checkForUpdates: 'Nach Updates suchen',
      // ... more translations
    },
  }}
>
```

---

## 🔧 Advanced Usage

### With App Theme Integration

```tsx
import { useTheme } from './your-theme-context';

function AppProviders({ children }) {
  const { colors, isDark } = useTheme();
  
  return (
    <OTAUpdatesProvider
      theme={{
        colors: {
          primary: colors.primary,
          background: colors.background,
          text: colors.text,
          // Map your theme colors
        },
      }}
    >
      {children}
    </OTAUpdatesProvider>
  );
}
```

### With i18n Library

```tsx
import { useTranslation } from 'react-i18next';

function AppProviders({ children }) {
  const { t } = useTranslation('ota');
  
  return (
    <OTAUpdatesProvider
      translations={{
        banner: {
          updateAvailable: t('banner.updateAvailable'),
          updateButton: t('banner.updateButton'),
          // ...
        },
      }}
    >
      {children}
    </OTAUpdatesProvider>
  );
}
```

---

## 📄 License

MIT License © 2025 [Danijel Dedic](mailto:dedic.d@gmail.com), [Technabit e.U.](https://technabit.at)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
