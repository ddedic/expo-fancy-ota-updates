# CLI Commands

Complete reference for all `ota-publish` commands.

## `ota-publish` (default)

Publish an OTA update with version tracking.

### Usage

```bash
ota-publish [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--channel <channel>` | `-c` | Target channel |
| `--message <message>` | `-m` | Custom changelog message |
| `--dry-run` | | Preview without publishing |
| `--no-increment` | | Skip version increment |
| `--interactive` | `-i` | Interactive mode |

### Examples

**Basic publish:**
```bash
ota-publish --channel production
```

**With custom message:**
```bash
ota-publish --channel production --message "Critical bug fix for iOS crash"
```

**Dry run:**
```bash
ota-publish --channel production --dry-run
```

**Interactive mode:**
```bash
ota-publish --interactive
```

**Skip version increment:**
```bash
ota-publish --channel development --no-increment
```

### What It Does

1. ✅ Loads configuration from `ota-updates.config.js`
2. ✅ Reads current `ota-version.json`
3. ✅ Increments version based on strategy
4. ✅ Generates changelog from configured source
5. ✅ Runs `beforePublish` hook (if configured)
6. ✅ Updates `ota-version.json`
7. ✅ Publishes to EAS: `eas update --channel <channel>`
8. ✅ Runs `afterPublish` hook (if configured)

### Output Example

```
📦 Publishing OTA update to production

✓ EAS configuration valid
Current version: 1.0.0-production.41 (build 41)
✓ Generated changelog (3 items)

📋 Version Information:
  Version:      1.0.0-production.42
  Build:        42
  Channel:      production
  Release Date: 12/7/2025, 2:30:00 PM

📝 Changelog:
  1. Fix critical payment flow bug
  2. Update dependencies
  3. Improve performance

✓ Updated ota-version.json
✓ Published to EAS

✨ Successfully published 1.0.0-production.42!
```

## `ota-publish init`

Initialize OTA updates configuration.

### Usage

```bash
ota-publish init
```

### What It Does

Creates `ota-updates.config.js` in your project root with default configuration.

### Output

```
📝 Initializing OTA Updates configuration...

✓ Created ota-updates.config.js

Next steps:
  1. Review and customize ota-updates.config.js
  2. Run: npx ota-publish --channel development
  3. Check ota-version.json for version tracking
```

### Generated Config

```javascript
export default {
  versionFile: './ota-version.json',
  baseVersion: '1.0.0',
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
};
```

## Interactive Mode

When using `--interactive`, you'll be prompted for:

1. **Channel selection** — Choose from configured channels
2. **Changelog source** — Use git commits or enter custom message
3. **Confirmation** — Review and confirm before publishing

### Example Session

```bash
$ ota-publish --interactive

? Select channel: › production
? Use git commits for changelog? › Yes
? Proceed with publish? › Yes

📦 Publishing OTA update to production
...
✨ Successfully published!
```

## npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "ota:dev": "ota-publish --channel development",
    "ota:preview": "ota-publish --channel preview",
    "ota:prod": "ota-publish --channel production",
    "ota:prod:dry": "ota-publish --channel production --dry-run"
  }
}
```

Then run:

```bash
npm run ota:dev
npm run ota:preview
npm run ota:prod
npm run ota:prod:dry
```

## Next Steps

- [Configuration Options →](/cli/configuration)
- [Hooks System →](/guides/hooks)
- [Complete Workflow →](/examples/workflow)
