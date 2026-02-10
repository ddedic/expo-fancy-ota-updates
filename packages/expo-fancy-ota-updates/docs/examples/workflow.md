# Complete Workflow

End-to-end example of using the package in a real app.

## Setup

### 1. Install Package

```bash
pnpm add @ddedic/expo-fancy-ota-updates
```

### 2. Create Version File

```json
// ota-version.json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "releaseDate": "2025-01-01T00:00:00.000Z",
  "changelog": ["Initial release"]
}
```

### 3. Configure App

```tsx
// app/_layout.tsx
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';
import { useColorScheme } from 'react-native';
import versionData from '../ota-version.json';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <OTAUpdatesProvider
      config={{
        versionData,
        checkOnMount: true,
        checkOnForeground: true,
        minCheckIntervalMs: 30000,
      }}
      theme={{
        colors: {
          primary: colorScheme === 'dark' ? '#6366F1' : '#4F46E5',
        },
      }}
    >
      <UpdateBanner />
      <Stack />
    </OTAUpdatesProvider>
  );
}
```

### 4. Add Settings Screen

```tsx
// app/settings/ota-updates.tsx
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';
import { useRouter } from 'expo-router';

export default function OTAUpdatesScreen() {
  const router = useRouter();
  
  return (
    <OTAInfoScreen 
      onBack={() => router.back()}
      hideDebug={!__DEV__}
    />
  );
}
```

### 5. Initialize CLI

```bash
npx ota-publish init
```

### 6. Configure CLI

```javascript
// ota-updates.config.js
export default {
  versionFile: './ota-version.json',
  baseVersion: 'package.json',
  versionStrategy: 'build',
  versionFormat: '{major}.{minor}.{patch}-{channelAlias}.{build}',
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },
  channelAliases: {
    development: 'd',
    preview: 'pr',
    production: 'p',
  },
  
  changelog: {
    source: 'git',
    commitCount: 10,
  },

  eas: {
    messageFormat: 'v{version}: {firstChange}',
    messageFormatByChannel: {
      production: 'release {version} ({channelAlias})',
    },
  },
  
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
  
  hooks: {
    beforePublish: async ({ channel }) => {
      if (channel === 'production') {
        const { execa } = await import('execa');
        await execa('npm', ['test']);
      }
    },
    generateVersion: async ({ defaultVersion }) => {
      return defaultVersion;
    },
    afterPublish: async (version, context) => {
      console.log(`✓ Published ${version.version} with message: ${context.message}`);
    },
  },
};
```

### 7. Add npm Scripts

```json
// package.json
{
  "scripts": {
    "ota:dev": "ota-publish --channel development",
    "ota:preview": "ota-publish --channel preview",
    "ota:prod": "ota-publish --channel production"
  }
}
```

## Daily Workflow

### Making Changes

```bash
# 1. Make your code changes
git add .
git commit -m "Fix critical bug in payment flow"

# 2. Publish OTA update
npm run ota:dev

# Output:
# 📦 Publishing OTA update to development
# ✓ Generated changelog (1 items)
# ✓ Updated ota-version.json
# ✓ Published to EAS
# ✨ Successfully published 1.0.0-development.42!
```

### Testing Updates

```bash
# 1. Publish to development
npm run ota:dev

# 2. Open app on device
# 3. Banner appears automatically
# 4. Tap "Update" to download
# 5. Tap "Restart" to apply
```

### Production Release

```bash
# 1. Test in preview first
npm run ota:preview

# 2. Verify on staging devices

# 3. Publish to production
npm run ota:prod

# One-off override examples:
ota-publish --channel production --strategy semver
ota-publish --channel production --version-format "{major}.{minor}.{patch}-p{build}"
ota-publish --channel production --platform ios

# Promote tested preview update to production:
ota-publish promote --from preview --to production --dry-run
ota-publish promote --from preview --to production

# 4. Monitor for issues

# 5. If needed, rollback safely:
ota-publish revert --channel production --dry-run
ota-publish revert --channel production
```

## Advanced Usage

### Custom Banner

```tsx
<UpdateBanner
  renderBanner={({ isDownloaded, onUpdate, onRestart, theme }) => (
    <View style={{ 
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
        {isDownloaded ? '🎉 Update Ready!' : '📦 New Version Available'}
      </Text>
      <TouchableOpacity
        onPress={isDownloaded ? onRestart : onUpdate}
        style={{
          backgroundColor: 'white',
          padding: 12,
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
          {isDownloaded ? 'Restart Now' : 'Download Update'}
        </Text>
      </TouchableOpacity>
    </View>
  )}
/>
```

### Manual Update Check

```tsx
function SettingsScreen() {
  const { checkForUpdate, isUpdateAvailable, status } = useOTAUpdates();
  
  return (
    <View>
      <Button
        title={status === 'checking' ? 'Checking...' : 'Check for Updates'}
        onPress={checkForUpdate}
        disabled={status === 'checking'}
      />
      {isUpdateAvailable && (
        <Text>Update available! Check the banner.</Text>
      )}
    </View>
  );
}
```

### Conditional Auto-Download

```tsx
<OTAUpdatesProvider
  config={{
    versionData,
    checkOnMount: true,
    autoDownload: __DEV__, // Only in development
  }}
>
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Publish OTA

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run ota:prod
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### GitLab CI

```yaml
publish-ota:
  script:
    - npm ci
    - npm run ota:prod
  only:
    - main
```

## Troubleshooting

### Banner Not Showing

1. Check `expo-updates` is configured
2. Verify `versionData` is passed to provider
3. Ensure `checkOnMount: true`
4. Check console for errors

### Update Not Downloading

1. Verify EAS configuration
2. Check network connection
3. Ensure channel matches
4. Check `expo-updates` logs

### CLI Errors

1. Run `ota-publish init` to create config
2. Verify `ota-version.json` exists
3. Check EAS CLI is installed
4. Ensure git repository is initialized

## Next Steps

- [Theming Guide →](/guides/theming)
- [Translations →](/guides/i18n)
- [Hooks System →](/guides/hooks)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/apps/expo-showcase).
