# useOTAUpdates Hook

Access OTA update state and actions from any component within the provider.

## Basic Usage

```tsx
import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

function MyComponent() {
  const { isUpdateAvailable, checkForUpdate } = useOTAUpdates();
  
  return (
    <Button 
      title="Check for Updates"
      onPress={checkForUpdate}
      disabled={!isUpdateAvailable}
    />
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

### expo-updates Metadata

| Property | Type | Description |
|----------|------|-------------|
| `currentUpdateId` | `string \| null` | Current update ID |
| `channel` | `string \| null` | Update channel |
| `runtimeVersion` | `string \| null` | Runtime version |
| `isEmbeddedUpdate` | `boolean` | Is embedded build |

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
| `checkForUpdate` | `() => Promise<void>` | Check for updates |
| `downloadUpdate` | `() => Promise<void>` | Download update |
| `reloadApp` | `() => Promise<void>` | Reload app |
| `simulateUpdate` | `() => void` | Simulate update (dev) |

### Theming

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `OTATheme` | Current theme |
| `translations` | `OTATranslations` | Current translations |

## UpdateStatus

```typescript
type UpdateStatus = 
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'downloaded'
  | 'error';
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
