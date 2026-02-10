# UpdateBanner

Animated banner component that appears when OTA updates are available.

## Basic Usage

```tsx
import { UpdateBanner } from '@ddedic/expo-fancy-ota-updates';

<UpdateBanner />
```

The banner automatically shows when an update is available and hides when dismissed.

## Props

### `style`
- **Type:** `ViewStyle`
- **Required:** No

Custom container style.

```tsx
<UpdateBanner style={{ marginTop: 20 }} />
```

### `visible`
- **Type:** `boolean`
- **Required:** No

Controlled visibility mode. When provided, you control when the banner shows.

```tsx
const [showBanner, setShowBanner] = useState(false);

<UpdateBanner 
  visible={showBanner} 
  onDismiss={() => setShowBanner(false)} 
/>
```

### `onDismiss`
- **Type:** `() => void`
- **Required:** No

Called when the banner is dismissed.

### `renderBanner`
- **Type:** `(props: RenderBannerProps) => ReactNode`
- **Required:** No

Custom render function to completely replace the banner UI.

## Custom Render

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

## RenderBannerProps

| Prop | Type | Description |
|------|------|-------------|
| `isDownloaded` | `boolean` | Update downloaded and ready |
| `isDownloading` | `boolean` | Currently downloading |
| `otaVersion` | `string` | Version number |
| `otaChangelog` | `string[]` | Changelog items |
| `onUpdate` | `() => void` | Start download |
| `onRestart` | `() => void` | Restart app |
| `onDismiss` | `() => void` | Dismiss banner |
| `theme` | `OTATheme` | Current theme |
| `translations` | `OTATranslations` | Current translations |

## Examples

### Controlled Mode

```tsx
function MyApp() {
  const [showBanner, setShowBanner] = useState(false);
  const { isUpdateAvailable } = useOTAUpdates();
  
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowBanner(true);
    }
  }, [isUpdateAvailable]);
  
  return (
    <UpdateBanner 
      visible={showBanner}
      onDismiss={() => setShowBanner(false)}
    />
  );
}
```

### Custom Styling

```tsx
<UpdateBanner 
  style={{
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
  }}
/>
```

## Features

- ✨ **Animated entrance/exit** with smooth transitions
- 🎨 **Gradient background** when `expo-linear-gradient` is installed
- 🧱 **Solid fallback** automatically when gradient dependency is not installed
- 💫 **Pulse animation** to draw attention
- 📱 **Safe area aware** respects device notches
- 🎯 **Auto-dismissible** or controlled mode

## Next Steps

- [OTAInfoScreen →](/ui-components/info-screen)
- [useOTAUpdates Hook →](/ui-components/hook)
- [Theming Guide →](/guides/theming)
