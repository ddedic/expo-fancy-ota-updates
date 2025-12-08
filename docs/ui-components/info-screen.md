# OTAInfoScreen

Full-screen component for displaying OTA update information, changelog, and manual controls.

## Basic Usage

```tsx
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';

function SettingsScreen() {
  const navigation = useNavigation();
  
  return (
    <OTAInfoScreen 
      onBack={() => navigation.goBack()} 
    />
  );
}
```

## Props

### `mode`
- **Type:** `'developer' | 'user'`
- **Default:** `'developer'`

Development mode shows extra debug info (runtime version, update ID, channel). User mode is cleaner and only shows what's relevant to end users.

### `renderInfo`
- **Type:** `(props: RenderInfoProps) => ReactNode`
- **Required:** No

Custom render for the info section (version, date, status).

### `renderActions`
- **Type:** `(props: RenderActionsProps) => ReactNode`
- **Required:** No

Custom render for the actions section (buttons, progress).

### `renderChangelog`
- **Type:** `(props: RenderChangelogProps) => ReactNode`
- **Required:** No

Custom render for the changelog list.

### Visibility Props
- `showRuntimeVersion` (boolean)
- `showOtaVersion` (boolean)
- `showReleaseDate` (boolean)
- `showUpdateId` (boolean)
- `showCheckButton` (boolean)
- `showDownloadButton` (boolean)
- `showReloadButton` (boolean)
- `showDebugSection` (boolean)

### `onBack`
- **Type:** `() => void`
- **Required:** No

Back navigation callback.

### `style`
- **Type:** `ViewStyle`
- **Required:** No

Custom container style.

## Modular Sub-Components

You can also import sub-components directly to build your own screen:

```tsx
import { 
  OTAUpdateInfo, 
  OTAUpdateActions, 
  OTAUpdateChangelog 
} from '@ddedic/expo-fancy-ota-updates';
```

## Features

- 📊 **Dual Modes** — Developer (debug info) vs User (simple view)
- 🧩 **Modular Architecture** — Use the whole screen or just parts of it
- 🎨 **Fully Customizable** — Render props for every section
- 📝 **Changelog Display** — Auto-parsed conventional commits
- 🎮 **Simulation Mode** — Test update flows with `simulateUpdate()`
- 🔄 **Manual Controls** — Check, download, reload with instant feedback

## Custom Header

```tsx
<OTAInfoScreen
  renderHeader={({ onBack, theme }) => (
    <View style={{ backgroundColor: theme.colors.primary }}>
      <TouchableOpacity onPress={onBack}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <Text>My Custom Header</Text>
    </View>
  )}
/>
```

## Example Integration

### With Expo Router

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

### With React Navigation

```tsx
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';

function OTAScreen({ navigation }) {
  return (
    <OTAInfoScreen 
      onBack={() => navigation.goBack()} 
    />
  );
}
```

### In Settings Menu

```tsx
function SettingsScreen() {
  const [showOTA, setShowOTA] = useState(false);
  
  if (showOTA) {
    return (
      <OTAInfoScreen 
        onBack={() => setShowOTA(false)} 
      />
    );
  }
  
  return (
    <View>
      <Button 
        title="OTA Updates" 
        onPress={() => setShowOTA(true)} 
      />
    </View>
  );
}
```

## Screenshot

<img src="/screenshots/screenshot-4.PNG?url" alt="OTA Info Screen" style="width: 100%; border-radius: 12px; margin-top: 20px;" />

The info screen displays:

1. **Header** — Title and back button
2. **Status Section** — Current update status
3. **Version Info** — Version, build, date, channel
4. **Changelog** — All changelog items
5. **Actions** — Check, download, reload buttons
6. **Debug** (optional) — Technical details

## Next Steps

- [useOTAUpdates Hook →](/ui-components/hook)
- [Theming Guide →](/guides/theming)
- [Complete Workflow →](/examples/workflow)
