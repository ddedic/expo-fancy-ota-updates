# CLI Configuration

Complete reference for `ota-updates.config.js` configuration options.

## Configuration File

Create `ota-updates.config.js` (or `.mjs`) in your project root:

```javascript
/**
 * @type {import('@ddedic/expo-fancy-ota-updates').OTAConfig}
 */
export default {
  // Your configuration
};
```

## Complete Example

```javascript
export default {
  versionFile: './ota-version.json',
  baseVersion: 'package.json',
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
  versionStrategy: 'build',
  
  changelog: {
    source: 'git',
    commitCount: 10,
    format: 'short',
    includeAuthor: false,
  },
  
  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
  },
  
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
  
  hooks: {
    beforePublish: async (version) => {
      console.log(`Publishing ${version.version}...`);
    },
    afterPublish: async (version) => {
      console.log(`Published ${version.version}`);
    },
    onError: async (error) => {
      console.error('Publish failed:', error);
    },
  },
};
```

## Options Reference

### `versionFile`
- **Type:** `string`
- **Default:** `'./ota-version.json'`

Path to the version tracking file.

### `baseVersion`
- **Type:** `string | 'package.json'`
- **Default:** `'1.0.0'`

Base version for versioning. Use `'package.json'` to read from package.json.

```javascript
baseVersion: 'package.json' // Reads from package.json
baseVersion: '2.0.0'        // Fixed base version
```

### `versionFormat`
- **Type:** `string`
- **Default:** `'{major}.{minor}.{patch}-{channel}.{build}'`

Version format template. Available placeholders:
- `{major}` — Major version
- `{minor}` — Minor version
- `{patch}` — Patch version
- `{channel}` — Channel name
- `{build}` — Build number
- `{timestamp}` — Date timestamp (only with `date` strategy)

**Examples:**
```javascript
'{major}.{minor}.{patch}-{channel}.{build}'
// → 1.0.0-production.42

'{major}.{minor}.{patch}.{build}'
// → 1.0.0.42

'v{major}.{minor}-{channel}'
// → v1.0-production
```

### `versionStrategy`
- **Type:** `'semver' | 'build' | 'date' | 'custom'`
- **Default:** `'build'`

Version increment strategy:

**`build`** — Increment build number only
```
1.0.0-production.42 → 1.0.0-production.43
```

**`semver`** — Auto-increment patch version
```
1.0.0-production.42 → 1.0.1-production.43
```

**`date`** — Include date in version
```
1.0.0-production.20250107
```

### `changelog`

Changelog generation configuration.

#### `changelog.source`
- **Type:** `'git' | 'manual' | 'file' | 'custom'`
- **Default:** `'git'`

Changelog source:
- `git` — Auto-generate from git commits
- `manual` — Interactive prompts
- `file` — Read from file
- `custom` — Use hooks

#### `changelog.commitCount`
- **Type:** `number`
- **Default:** `10`

Number of git commits to include (when `source: 'git'`).

#### `changelog.format`
- **Type:** `'short' | 'detailed'`
- **Default:** `'short'`

Changelog format:
- `short` — Commit messages only
- `detailed` — Include commit body

#### `changelog.includeAuthor`
- **Type:** `boolean`
- **Default:** `false`

Include commit author in changelog.

#### `changelog.filePath`
- **Type:** `string`
- **Required:** When `source: 'file'`

Path to changelog file.

```javascript
changelog: {
  source: 'file',
  filePath: './CHANGELOG.md',
}
```

### `eas`

EAS publishing configuration.

#### `eas.autoPublish`
- **Type:** `boolean`
- **Default:** `true`

Automatically publish to EAS after version update.

#### `eas.messageFormat`
- **Type:** `string`
- **Default:** `'v{version}: {firstChange}'`

EAS update message format. Available placeholders:
- `{version}` — Full version string
- `{channel}` — Channel name
- `{build}` — Build number
- `{firstChange}` — First changelog item
- `{date}` — Release date

### `channels`
- **Type:** `string[]`
- **Default:** `['development', 'preview', 'production']`

Available channels for publishing.

### `defaultChannel`
- **Type:** `string`
- **Default:** `'development'`

Default channel when not specified.

### `hooks`

Custom hooks for lifecycle events. See [Hooks Guide](/guides/hooks).

## Examples

### Read Version from package.json

```javascript
export default {
  baseVersion: 'package.json',
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
};
```

### Semver Strategy

```javascript
export default {
  versionStrategy: 'semver',
  versionFormat: '{major}.{minor}.{patch}',
};
```

### File-based Changelog

```javascript
export default {
  changelog: {
    source: 'file',
    filePath: './CHANGELOG.md',
  },
};
```

### Custom Channels

```javascript
export default {
  channels: ['dev', 'staging', 'prod', 'beta'],
  defaultChannel: 'dev',
};
```

## Next Steps

- [CLI Commands →](/cli/commands)
- [Hooks System →](/guides/hooks)
- [Complete Workflow →](/examples/workflow)
