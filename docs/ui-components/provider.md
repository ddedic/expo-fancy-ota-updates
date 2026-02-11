# OTAUpdatesProvider

The main context provider that enables OTA update functionality throughout your app.

## Basic Usage

```tsx
import { OTAUpdatesProvider } from '@ddedic/expo-fancy-ota-updates';
import versionData from './ota-version.json';

export default function App() {
  return (
    <OTAUpdatesProvider config={{ versionData }}>
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

## Props

### `children`
- **Type:** `ReactNode`
- **Required:** Yes

Your app content.

### `theme`
- **Type:** `Partial<OTATheme>`
- **Required:** No
- **Default:** `defaultTheme`

Custom theme configuration. Merged with defaults.

```tsx
<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#6366F1',
      background: '#0B0B0F',
    },
    borderRadius: 16,
  }}
>
```

See [Theming Guide](/guides/theming) for details.

### `translations`
- **Type:** `Partial<OTATranslations>`
- **Required:** No
- **Default:** `defaultTranslations` (English)

Custom translations. Merged with defaults.

```tsx
<OTAUpdatesProvider
  translations={{
    banner: {
      updateAvailable: 'Neue Version verfügbar',
      updateButton: 'Aktualisieren',
    },
  }}
>
```

See [i18n Guide](/guides/i18n) for details.

### `config`
- **Type:** `OTAConfig`
- **Required:** No

Provider behavior configuration.

```tsx
<OTAUpdatesProvider
  config={{
    checkOnMount: true,
    checkOnForeground: true,
    minCheckIntervalMs: 30000,
    recordSkippedChecks: true,
    autoDownload: false,
    autoReload: false,
    versionData: require('./ota-version.json'),
    debug: __DEV__,
  }}
>
```

## Config Options

### `checkOnMount`
- **Type:** `boolean`
- **Default:** `true`

Check for updates when the provider mounts.

### `checkOnForeground`
- **Type:** `boolean`
- **Default:** `true`

Check for updates when the app comes to foreground.

### `minCheckIntervalMs`
- **Type:** `number`
- **Default:** `0`

Minimum interval between `checkForUpdate` calls in milliseconds. Useful to prevent rapid re-checks when users repeatedly foreground the app.

### `recordSkippedChecks`
- **Type:** `boolean`
- **Default:** `true`

When true, skipped checks (DEV mode, simulator, throttled, updates disabled) still update `lastCheck` and expose a skip reason via `lastSkippedReason` in `useOTAUpdates()`.

### `autoDownload`
- **Type:** `boolean`
- **Default:** `false`

Automatically download updates when available.

### `autoReload`
- **Type:** `boolean`
- **Default:** `false`

Automatically reload the app after download completes.

::: warning
Use `autoReload: true` carefully. It will reload the app without user confirmation.
:::

### `versionData`
- **Type:** `OTAVersionData`
- **Required:** No

Version information from `ota-version.json`.

```tsx
import versionData from './ota-version.json';

<OTAUpdatesProvider config={{ versionData }}>
```

### `debug`
- **Type:** `boolean`
- **Default:** `__DEV__`

Enable debug logging.

## Complete Example

```tsx
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';
import { useColorScheme } from 'react-native';
import versionData from './ota-version.json';

export default function App() {
  const colorScheme = useColorScheme();
  
  return (
    <OTAUpdatesProvider
      theme={{
        colors: {
          primary: colorScheme === 'dark' ? '#6366F1' : '#4F46E5',
          background: colorScheme === 'dark' ? '#0B0B0F' : '#FFFFFF',
        },
      }}
      config={{
        checkOnMount: true,
        checkOnForeground: true,
        minCheckIntervalMs: 30000,
        recordSkippedChecks: true,
        versionData,
      }}
    >
      <UpdateBanner />
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

## Next Steps

- [UpdateBanner Component →](/ui-components/banner)
- [useOTAUpdates Hook →](/ui-components/hook)
- [Theming Guide →](/guides/theming)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/examples/expo-showcase).
