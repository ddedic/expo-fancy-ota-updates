# CLI Publishing Tool

The package includes a powerful CLI tool for publishing OTA updates with version tracking and changelog generation.

## Quick Start

### 1. Initialize Configuration

```bash
npx ota-publish init
```

This creates `ota-updates.config.js` (or `.mjs`) in your project root.

### 2. Publish an Update

```bash
# Publish to development channel
npx ota-publish --channel development

# Or use interactive mode
npx ota-publish --interactive
```

## Usage in Your App

### Option A: Direct Command (after npm publish)

Once published to npm, use directly:

```bash
npx ota-publish --channel production
```

### Option B: Local Package (before npm publish)

If using the package locally, create npm scripts:

```json
{
  "scripts": {
    "ota:dev": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel development",
    "ota:preview": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel preview",
    "ota:prod": "node node_modules/@ddedic/expo-fancy-ota-updates/bin/ota-publish.js --channel production"
  }
}
```

Then run:

```bash
npm run ota:dev
npm run ota:preview
npm run ota:prod
```

## CLI Commands

### `ota-publish` (default)

Publish an OTA update.

**Options:**
- `-c, --channel <channel>` — Target channel (development, preview, production)
- `-m, --message <message>` — Custom changelog message
- `--dry-run` — Preview without publishing
- `--no-increment` — Skip version increment
- `-i, --interactive` — Interactive mode with prompts

**Examples:**

```bash
# Basic publish
ota-publish --channel production

# With custom message
ota-publish --channel production --message "Critical bug fix"

# Dry run (preview only)
ota-publish --channel production --dry-run

# Interactive mode
ota-publish --interactive
```

### `ota-publish init`

Initialize configuration file.

```bash
ota-publish init
```

## Configuration

The `ota-updates.config.js` file controls CLI behavior:

```javascript
/**
 * @type {import('@ddedic/expo-fancy-ota-updates').OTAConfig}
 */
export default {
  // Version file location
  versionFile: './ota-version.json',
  
  // Base version (or 'package.json' to read from package.json)
  baseVersion: '1.0.0',
  
  // Version format template
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
  
  // Version strategy: 'semver' | 'build' | 'date'
  versionStrategy: 'build',
  
  // Changelog configuration
  changelog: {
    source: 'git', // 'git' | 'manual' | 'file'
    commitCount: 10,
    format: 'short', // 'short' | 'detailed'
    includeAuthor: false,
  },
  
  // EAS configuration
  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
  },
  
  // Available channels
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
  
  // Hooks (optional)
  hooks: {
    beforePublish: async (version) => {
      console.log(`Publishing ${version.version}...`);
      // Run tests, linting, etc.
    },
    afterPublish: async (version) => {
      console.log(`Published ${version.version}`);
      // Send notifications, update docs, etc.
    },
    onError: async (error) => {
      console.error('Publish failed:', error);
    },
  },
};
```

### Version Strategies

**`build` (default)** — Increment build number only
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

### Changelog Sources

**`git`** — Auto-generate from git commits (default)
```javascript
changelog: {
  source: 'git',
  commitCount: 10,
  format: 'short', // or 'detailed'
  includeAuthor: false,
}
```

**`manual`** — Interactive prompts
```javascript
changelog: {
  source: 'manual',
}
```

**`file`** — Read from file
```javascript
changelog: {
  source: 'file',
  filePath: './CHANGELOG.md',
}
```

### Hooks

Run custom logic at different stages:

```javascript
hooks: {
  // Before publishing (e.g., run tests)
  beforePublish: async ({ currentVersion, channel, changelog }) => {
    console.log(`Publishing to ${channel}...`);
    // Run: await execa('npm', ['test']);
  },
  
  // After successful publish (e.g., send notifications)
  afterPublish: async (version) => {
    console.log(`✓ Published ${version.version}`);
    // Send Slack notification, update docs, etc.
  },
  
  // On error (e.g., rollback, alert)
  onError: async (error) => {
    console.error('Publish failed:', error.message);
    // Send error alert
  },
}
```

## Workflow Example

```bash
# 1. Make your code changes
git add .
git commit -m "Fix critical bug in payment flow"

# 2. Publish OTA update (uses git commit as changelog)
npm run ota:prod

# Output:
# 📦 Publishing OTA update to production
# 
# ✓ EAS configuration valid
# Current version: 1.0.0-production.41 (build 41)
# ✓ Generated changelog (1 items)
# 
# 📋 Version Information:
#   Version:      1.0.0-production.42
#   Build:        42
#   Channel:      production
#   Release Date: 12/7/2025, 2:30:00 PM
# 
# 📝 Changelog:
#   1. Fix critical bug in payment flow
# 
# ✓ Updated ota-version.json
# ✓ Published to EAS
# 
# ✨ Successfully published 1.0.0-production.42!
```

---
