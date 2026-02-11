# Getting Started

Get up and running with Expo Fancy OTA Updates in minutes.

## Prerequisites

- Expo SDK 54+ (with `expo-updates` configured)
- React Native app with Expo Router
- EAS CLI installed (`pnpm add -g eas-cli`)

## Installation

::: code-group

```bash [pnpm]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [npm]
npm install @ddedic/expo-fancy-ota-updates
```

```bash [yarn]
yarn add @ddedic/expo-fancy-ota-updates
```

:::

### Peer Dependencies

The following dependencies are required:

```bash
pnpm add expo expo-updates expo-device react react-native react-native-reanimated react-native-safe-area-context
```

### Optional Dependencies

For enhanced visuals:

```bash
# For gradient banners (optional; falls back to solid background if missing)
pnpm add expo-linear-gradient

# For beautiful icons (recommended)
pnpm add lucide-react-native react-native-svg
```

## Quick Setup

### 1. Create Version File

Create `ota-version.json` in your project root:

```json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "releaseDate": "2026-01-01T00:00:00.000Z",
  "changelog": ["Initial release"]
}
```

### 2. Add Provider

Wrap your app with `OTAUpdatesProvider`:

```tsx
// App.tsx or _layout.tsx
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';
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

### 3. Initialize CLI

```bash
npx ota-publish init
```

This creates `ota-updates.config.js` for CLI configuration.

### 4. Publish Your First Update

```bash
npx ota-publish --channel development
```

That's it! 🎉 The banner will automatically appear when an OTA update is detected.

## What's Next?

- [Learn about UI Components](/ui-components/provider)
- [Explore the CLI Tool](/cli/overview)
- [Customize the Theme](/guides/theming)
- [Add Translations](/guides/i18n)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/examples/expo-showcase).
