# CLI Configuration

The CLI is configured via `ota-updates.config.js` (or `.mjs`, `.json`) in your project root. Run `npx ota-publish init` to generate a starter config.

## Config File

Create the file manually or generate it:

```bash
npx ota-publish init
```

The file uses the `OTAConfig` type for full IntelliSense:

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

  // Default template
  versionFormat: '{major}.{minor}.{patch}-{channelAlias}.{build}',

  // Optional per-channel template overrides
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },

  // build | semver | date | custom
  versionStrategy: 'build',

  // Optional short labels for templates/messages
  channelAliases: {
    development: 'd',
    preview: 'pr',
    production: 'p',
  },

  changelog: {
    source: 'git', // git | manual | file | custom
    commitCount: 10,
    format: 'short', // short | detailed
    includeAuthor: false,
    // filePath: './release-notes.md',
  },

  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
    messageFormatByChannel: {
      production: 'release {version} ({channelAlias})',
    },
    platforms: ['ios', 'android'],
  },

  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',

  hooks: {
    beforePublish: async ({ changelog }) => {
      return {
        changelog: changelog.slice(0, 5),
      };
    },
    generateVersion: async ({ defaultVersion, templateVars }) => {
      return `${defaultVersion}-b${templateVars.build}`;
    },
    generateChangelog: async () => {
      return ['Custom release note'];
    },
    afterPublish: async (version, context) => {
      console.log(`Published ${version.version} with message: ${context.message}`);
    },
    onError: async (error, context) => {
      console.error(`Publish failed for channel ${context.channel}:`, error.message);
    },
  },
};
```

## Options Reference

### `versionFile`
- **Type:** `string`
- **Default:** `'./ota-version.json'`

Path to version tracking file.

### `baseVersion`
- **Type:** `string | 'package.json'`
- **Default:** `'1.0.0'`

Base semantic version used by version strategies.

### `versionFormat`
- **Type:** `string`
- **Default:** `'{major}.{minor}.{patch}-{channel}.{build}'`

Default version template.

### `versionFormatByChannel`
- **Type:** `Record<string, string>`
- **Default:** `{}`

Per-channel version templates. Channel keys must exist in `channels`.

### `versionStrategy`
- **Type:** `'semver' | 'build' | 'date' | 'custom'`
- **Default:** `'build'`

Version strategy:

- `build`: increments build number.
- `semver`: increments patch and build number.
- `date`: keeps semver base and uses `{timestamp}` if present in template.
- `custom`: uses `hooks.generateVersion` (required).

### `channelAliases`
- **Type:** `Record<string, string>`
- **Default:** `{}`

Short aliases for channel names (e.g. `production -> p`). Available in templates as `{channelAlias}`.

### `changelog.source`
- **Type:** `'git' | 'manual' | 'file' | 'custom'`
- **Default:** `'git'`

- `git`: from recent commits.
- `manual`: interactive input.
- `file`: from `changelog.filePath` (resolved relative to config/project cwd).
- `custom`: from `hooks.generateChangelog` (required).

### `changelog.commitCount`
- **Type:** `number`
- **Default:** `10`

Number of commits when `source: 'git'`.

### `changelog.format`
- **Type:** `'short' | 'detailed'`
- **Default:** `'short'`

### `changelog.includeAuthor`
- **Type:** `boolean`
- **Default:** `false`

### `changelog.filePath`
- **Type:** `string`
- **Required:** When `source: 'file'`

### `eas.autoPublish`
- **Type:** `boolean`
- **Default:** `true`

### `eas.messageFormat`
- **Type:** `string`
- **Default:** `'v{version}: {firstChange}'`

Default EAS message template.

### `eas.messageFormatByChannel`
- **Type:** `Record<string, string>`
- **Default:** `{}`

Per-channel EAS message templates.

### `eas.platforms`
- **Type:** `('ios' | 'android')[]`
- **Default:** `undefined` (EAS default behavior)

### `channels`
- **Type:** `string[]`
- **Default:** `['development', 'preview', 'production']`

Must contain unique values.

### `defaultChannel`
- **Type:** `string`
- **Default:** `'development'`

Must be included in `channels`.

### `hooks`
- **Type:** `OTAHooks`

See [Hooks Guide](/guides/hooks) for full signatures.

## Template Variables

Version templates support:

- `{major}`
- `{minor}`
- `{patch}`
- `{channel}`
- `{channelAlias}`
- `{build}`
- `{timestamp}` (YYYYMMDD)

EAS message templates support:

- `{version}`
- `{channel}`
- `{channelAlias}`
- `{build}`
- `{firstChange}`
- `{date}`

## Popular Patterns

### Short Production Version

```javascript
export default {
  channelAliases: { production: 'p' },
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },
};
```

### Keep Version Compact Everywhere

```javascript
export default {
  channelAliases: {
    development: 'd',
    preview: 'pr',
    production: 'p',
  },
  versionFormat: '{major}.{minor}.{patch}-{channelAlias}.{build}',
};
```

### Fully Custom Strategy

```javascript
export default {
  versionStrategy: 'custom',
  hooks: {
    generateVersion: async ({ templateVars }) => {
      return `r${templateVars.major}.${templateVars.minor}.${templateVars.build}`;
    },
  },
};
```

## Next Steps

- [CLI Commands](/cli/commands)
- [Hooks System](/guides/hooks)
- [Complete Workflow](/examples/workflow)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/examples/expo-showcase).
