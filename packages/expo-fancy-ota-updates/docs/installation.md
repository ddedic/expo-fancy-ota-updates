# Installation

## Prerequisites

Before installing, ensure you have:

- **Expo SDK 50+** with `expo-updates` configured
- **React Native** app with Expo Router
- **EAS CLI** installed globally

## Install Package

::: code-group

```bash [bun]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [npm]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [yarn]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [pnpm]
pnpm add @ddedic/expo-fancy-ota-updates
```

:::

## Install Peer Dependencies

### Required Dependencies

```bash
pnpm add expo expo-updates expo-device react react-native react-native-reanimated react-native-safe-area-context
```

### Optional Dependencies

For enhanced UI features:

```bash
# Gradient banners (optional; falls back to solid background if missing)
pnpm add expo-linear-gradient

# Beautiful icons (recommended)
pnpm add lucide-react-native react-native-svg
```

## Configure Expo Updates

Ensure `expo-updates` is configured in your `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## Install EAS CLI

If you haven't already:

```bash
pnpm add -g eas-cli
```

## Verify Installation

Create a simple test:

```tsx
import { OTAUpdatesProvider } from '@ddedic/expo-fancy-ota-updates';

export default function App() {
  return (
    <OTAUpdatesProvider>
      <Text>OTA Updates Ready!</Text>
    </OTAUpdatesProvider>
  );
}
```

If no errors appear, you're all set! ✅

## Next Steps

- [Get Started →](/getting-started)
- [Learn about the Provider →](/ui-components/provider)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/apps/expo-showcase).
