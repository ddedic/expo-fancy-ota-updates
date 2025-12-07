# Installation

## Prerequisites

Before installing, ensure you have:

- **Expo SDK 50+** with `expo-updates` configured
- **React Native** app with Expo Router
- **EAS CLI** installed globally

## Install Package

::: code-group

```bash [bun]
bun add @ddedic/expo-fancy-ota-updates
```

```bash [npm]
npm install @ddedic/expo-fancy-ota-updates
```

```bash [yarn]
yarn add @ddedic/expo-fancy-ota-updates
```

```bash [pnpm]
pnpm add @ddedic/expo-fancy-ota-updates
```

:::

## Install Peer Dependencies

### Required Dependencies

```bash
bun add expo expo-updates expo-device react react-native react-native-reanimated react-native-safe-area-context
```

### Optional Dependencies

For enhanced UI features:

```bash
# Gradient banners (recommended)
bun add expo-linear-gradient

# Beautiful icons (recommended)
bun add lucide-react-native react-native-svg
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
npm install -g eas-cli
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
