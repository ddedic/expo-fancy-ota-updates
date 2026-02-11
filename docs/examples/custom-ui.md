# Custom UI Examples

Examples of customizing the UI components.

## Custom Banner

### Minimal Banner

```tsx
<UpdateBanner
  renderBanner={({ isDownloaded, onUpdate, onRestart, onDismiss }) => (
    <View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#000' }}>
      <Text style={{ flex: 1, color: '#fff' }}>
        {isDownloaded ? 'Update ready' : 'Update available'}
      </Text>
      <Button
        title={isDownloaded ? 'Restart' : 'Update'}
        onPress={isDownloaded ? onRestart : onUpdate}
      />
      <Button title="×" onPress={onDismiss} />
    </View>
  )}
/>
```

### Card-Style Banner

```tsx
<UpdateBanner
  renderBanner={({ isDownloaded, otaVersion, onUpdate, onRestart, theme }) => (
    <View style={{
      margin: 16,
      padding: 20,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
        {isDownloaded ? '✓ Ready to Install' : '📦 New Version'}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
        Version {otaVersion}
      </Text>
      <TouchableOpacity
        onPress={isDownloaded ? onRestart : onUpdate}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 14,
          borderRadius: 12,
          marginTop: 16,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {isDownloaded ? 'Restart App' : 'Download Now'}
        </Text>
      </TouchableOpacity>
    </View>
  )}
/>
```

### Bottom Sheet Banner

```tsx
import { BottomSheet } from 'your-bottom-sheet-library';

function CustomUpdateBanner() {
  const { isUpdateAvailable, isDownloaded, downloadUpdate, reloadApp } = useOTAUpdates();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isUpdateAvailable) setVisible(true);
  }, [isUpdateAvailable]);
  
  return (
    <BottomSheet visible={visible} onClose={() => setVisible(false)}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {isDownloaded ? 'Update Ready!' : 'New Update Available'}
        </Text>
        <Text style={{ marginTop: 8, color: '#666' }}>
          {isDownloaded 
            ? 'Restart the app to apply the latest update.'
            : 'Download the latest version to get new features and fixes.'}
        </Text>
        <Button
          title={isDownloaded ? 'Restart Now' : 'Download Update'}
          onPress={isDownloaded ? reloadApp : downloadUpdate}
        />
      </View>
    </BottomSheet>
  );
}
```

## Custom Info Screen

### Minimal Info Screen

```tsx
function MinimalOTAScreen() {
  const { 
    otaVersion, 
    otaBuildNumber, 
    otaChangelog,
    checkForUpdate,
    downloadUpdate,
    reloadApp,
    isUpdateAvailable,
    isDownloaded,
  } = useOTAUpdates();
  
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Version {otaVersion}
      </Text>
      <Text style={{ color: '#666' }}>
        Build {otaBuildNumber}
      </Text>
      
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>What's New</Text>
        {otaChangelog.map((item, i) => (
          <Text key={i} style={{ marginTop: 8 }}>
            • {item}
          </Text>
        ))}
      </View>
      
      <View style={{ marginTop: 24, gap: 12 }}>
        <Button title="Check for Updates" onPress={checkForUpdate} />
        {isUpdateAvailable && (
          <Button title="Download Update" onPress={downloadUpdate} />
        )}
        {isDownloaded && (
          <Button title="Restart App" onPress={reloadApp} />
        )}
      </View>
    </ScrollView>
  );
}
```

### Detailed Info Screen

```tsx
function DetailedOTAScreen() {
  const ota = useOTAUpdates();
  
  return (
    <ScrollView>
      {/* Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <StatusBadge status={ota.status} />
      </View>
      
      {/* Version Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Version Information</Text>
        <InfoRow label="Version" value={ota.otaVersion} />
        <InfoRow label="Build" value={ota.otaBuildNumber} />
        <InfoRow label="Channel" value={ota.channel} />
        <InfoRow label="Released" value={new Date(ota.otaReleaseDate).toLocaleDateString()} />
      </View>
      
      {/* Changelog */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Changelog</Text>
        {ota.otaChangelog.map((item, i) => (
          <ChangelogItem key={i} text={item} />
        ))}
      </View>
      
      {/* Actions */}
      <View style={styles.card}>
        <ActionButton
          title="Check for Updates"
          onPress={ota.checkForUpdate}
          disabled={ota.status === 'checking'}
        />
        {ota.isUpdateAvailable && (
          <ActionButton
            title="Download Update"
            onPress={ota.downloadUpdate}
            disabled={ota.isDownloading}
          />
        )}
        {ota.isDownloaded && (
          <ActionButton
            title="Restart App"
            onPress={ota.reloadApp}
            primary
          />
        )}
      </View>
    </ScrollView>
  );
}
```

## Integration Examples

### With React Navigation

```tsx
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="OTAUpdates" 
        component={() => (
          <OTAInfoScreen onBack={() => navigation.goBack()} />
        )}
      />
    </Stack.Navigator>
  );
}
```

### With Expo Router

```tsx
// app/settings/ota.tsx
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';
import { useRouter } from 'expo-router';

export default function OTAScreen() {
  const router = useRouter();
  return <OTAInfoScreen onBack={() => router.back()} />;
}
```

### With Modal

```tsx
function SettingsScreen() {
  const [showOTA, setShowOTA] = useState(false);
  
  return (
    <>
      <Button title="OTA Updates" onPress={() => setShowOTA(true)} />
      
      <Modal visible={showOTA} animationType="slide">
        <OTAInfoScreen onBack={() => setShowOTA(false)} />
      </Modal>
    </>
  );
}
```

## Styling Examples

### Match Your Brand

```tsx
const brandTheme = {
  colors: {
    primary: '#FF6B6B',
    primaryLight: '#FF8787',
    background: '#1A1A2E',
    text: '#EAEAEA',
  },
  bannerGradient: ['#FF6B6B', '#FFE66D'],
  borderRadius: 20,
};

<OTAUpdatesProvider theme={brandTheme}>
```

### Glassmorphism Style

```tsx
<UpdateBanner
  renderBanner={({ isDownloaded, onUpdate, onRestart }) => (
    <BlurView intensity={80} style={{
      margin: 16,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          {isDownloaded ? 'Update Ready' : 'New Update'}
        </Text>
        <TouchableOpacity
          onPress={isDownloaded ? onRestart : onUpdate}
          style={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            padding: 14,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isDownloaded ? 'Restart' : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  )}
/>
```

## Next Steps

- [Theming Guide →](/guides/theming)
- [useOTAUpdates Hook →](/ui-components/hook)
- [Complete Workflow →](/examples/workflow)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/examples/expo-showcase).
