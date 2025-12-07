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

### `onBack`
- **Type:** `() => void`
- **Required:** No

Back navigation callback. If not provided, no back button is shown.

### `hideDebug`
- **Type:** `boolean`
- **Default:** `false`

Hide the debug section.

```tsx
<OTAInfoScreen hideDebug={!__DEV__} />
```

### `style`
- **Type:** `ViewStyle`
- **Required:** No

Custom container style.

### `renderHeader`
- **Type:** `(props: RenderHeaderProps) => ReactNode`
- **Required:** No

Custom header render function.

## Features

- 📊 **Version Information** — Current version, build number, release date
- 📝 **Changelog Display** — All changelog items
- 🔄 **Manual Controls** — Check, download, reload buttons
- 🐛 **Debug Section** — Update ID, channel, runtime version
- 🎨 **Themed** — Respects provider theme
- 📱 **Safe Area Aware** — Works with notches

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
