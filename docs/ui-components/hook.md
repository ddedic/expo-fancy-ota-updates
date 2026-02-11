# useOTAUpdates Hook

Access OTA update state and actions from any component within the provider.

## Basic Usage

```tsx
import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

function MyComponent() {
  const { status, checkForUpdate, downloadUpdate, isUpdateAvailable } = useOTAUpdates();

  return (
    <View>
      <Button
        title={status === 'checking' ? 'Checking...' : 'Check for Updates'}
        onPress={checkForUpdate}
        disabled={status === 'checking'}
      />
      {isUpdateAvailable && (
        <Button title="Download Update" onPress={downloadUpdate} />
      )}
    </View>
  );
}
```

## Return Value

### State

| Property | Type | Description |
|----------|------|-------------|
| `isUpdateAvailable` | `boolean` | Update available to download |
| `isDownloading` | `boolean` | Currently downloading |
| `isDownloaded` | `boolean` | Download complete, ready to apply |
| `status` | `UpdateStatus` | Current status |
| `checkError` | `Error \| null` | Check error if any |
| `downloadError` | `Error \| null` | Download error if any |
| `lastCheck` | `Date \| null` | Last check timestamp |
| `lastSkippedReason` | `string \| null` | Most recent skip reason (DEV/simulator/throttle/disabled) |
| `isSimulating` | `boolean` | Showing a simulated update banner (for testing) |

### expo-updates Metadata

| Property | Type | Description |
|----------|------|-------------|
| `currentUpdateId` | `string \| null` | Current update ID |
| `channel` | `string \| null` | Update channel |
| `runtimeVersion` | `string \| null` | Runtime version |
| `isEmbeddedUpdate` | `boolean` | Is embedded build |

### Channel Switching

| Property | Type | Description |
|----------|------|-------------|
| `isSwitchingChannel` | `boolean` | Channel switch in progress |
| `switchChannel` | `(channel: string) => Promise<SwitchChannelResult>` | Switch update channel at runtime |

### Version Data

| Property | Type | Description |
|----------|------|-------------|
| `otaVersion` | `string` | Version (e.g., "1.0.0-production.29") |
| `otaBuildNumber` | `number` | Build number |
| `otaReleaseDate` | `string` | Release date (ISO) |
| `otaChangelog` | `string[]` | Changelog items |

### Actions

| Method | Type | Description |
|--------|------|-------------|
| `checkForUpdate` | `() => Promise<CheckResult>` | Check for updates |
| `downloadUpdate` | `() => Promise<void>` | Download update |
| `reloadApp` | `() => Promise<void>` | Reload app |
| `simulateUpdate` | `() => void` | Simulate update (dev) |
| `resetSimulation` | `() => void` | Reset simulation state |

### Theming

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `OTATheme` | Current theme |
| `translations` | `OTATranslations` | Current translations |

## Types

### UpdateStatus

```typescript
type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'downloaded'
  | 'error';
```

### CheckResult

Returned by `checkForUpdate()`:

```typescript
interface CheckResult {
  isAvailable: boolean;
  status: UpdateStatus;
  isSkipped?: boolean;  // true when skipped (DEV, simulator, throttled)
  reason?: string;      // why it was skipped
  error?: Error;
  manifest?: any;
}
```

### SwitchChannelResult

Returned by `switchChannel()`:

```typescript
interface SwitchChannelResult {
  success: boolean;
  previousChannel: string | null;
  newChannel: string;
  isSkipped?: boolean;
  reason?: string;
  error?: Error;
}
```

## Examples

### Manual Check Button

```tsx
function CheckButton() {
  const { checkForUpdate, status } = useOTAUpdates();
  
  return (
    <Button
      title={status === 'checking' ? 'Checking...' : 'Check for Updates'}
      onPress={checkForUpdate}
      disabled={status === 'checking'}
    />
  );
}
```

### Handle Skipped Checks

```tsx
function CheckButtonWithSkipInfo() {
  const { checkForUpdate, lastSkippedReason } = useOTAUpdates();

  const onCheck = async () => {
    const result = await checkForUpdate();
    if (result.isSkipped) {
      console.log('Skipped:', result.reason);
    }
  };

  return (
    <View>
      <Button title="Check for Updates" onPress={onCheck} />
      {lastSkippedReason && <Text>Last skipped: {lastSkippedReason}</Text>}
    </View>
  );
}
```

### Download Progress

```tsx
function DownloadStatus() {
  const { isDownloading, isDownloaded, downloadUpdate } = useOTAUpdates();
  
  if (isDownloading) {
    return <ActivityIndicator />;
  }
  
  if (isDownloaded) {
    return <Text>Update ready! Restart to apply.</Text>;
  }
  
  return <Button title="Download Update" onPress={downloadUpdate} />;
}
```

### Version Display

```tsx
function VersionInfo() {
  const { otaVersion, otaBuildNumber, otaReleaseDate } = useOTAUpdates();
  
  return (
    <View>
      <Text>Version: {otaVersion}</Text>
      <Text>Build: {otaBuildNumber}</Text>
      <Text>Released: {new Date(otaReleaseDate).toLocaleDateString()}</Text>
    </View>
  );
}
```

### Error Handling

```tsx
function UpdateWithError() {
  const { checkForUpdate, checkError, downloadError } = useOTAUpdates();
  
  const error = checkError || downloadError;
  
  return (
    <View>
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      <Button title="Check for Updates" onPress={checkForUpdate} />
    </View>
  );
}
```

### Channel Surfing (Runtime Channel Switch)

Switch the update channel at runtime — great for letting QA/stakeholders preview updates from other channels without rebuilding. Requires Expo SDK 54+.

```tsx
function ChannelPicker() {
  const { channel, isSwitchingChannel, switchChannel } = useOTAUpdates();

  const handleSwitch = async (name: string) => {
    const result = await switchChannel(name);
    if (result.isSkipped) {
      Alert.alert('Skipped', result.reason ?? 'Unknown');
    } else if (result.success) {
      Alert.alert('Switched', `Now on "${result.newChannel}"`);
    }
  };

  return (
    <View>
      <Text>Channel: {channel ?? 'N/A'}</Text>
      {isSwitchingChannel && <ActivityIndicator />}
      <Button title="Production" onPress={() => handleSwitch('production')} />
      <Button title="Staging" onPress={() => handleSwitch('staging')} />
    </View>
  );
}
```

The method uses the same guard pattern as `checkForUpdate` — it skips in DEV mode, simulators, and when updates are disabled. See [SwitchChannelResult](#switchchannelresult) above for the return type.

### Simulate Update (Development)

```tsx
function DevTools() {
  const { simulateUpdate } = useOTAUpdates();

  if (!__DEV__) return null;

  return (
    <Button
      title="Simulate Update (Dev Only)"
      onPress={simulateUpdate}
    />
  );
}
```

## Next Steps

- [OTAUpdatesProvider →](/ui-components/provider)
- [UpdateBanner →](/ui-components/banner)
- [Complete Workflow Example →](/examples/workflow)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/examples/expo-showcase).
