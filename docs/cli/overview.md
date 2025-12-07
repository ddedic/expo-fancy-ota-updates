# CLI Overview

The `ota-publish` CLI tool automates OTA update publishing with intelligent version tracking and changelog generation.

## What It Does

```bash
npx ota-publish --channel production
```

**Automatically:**
1. 📖 Reads current `ota-version.json`
2. 🔢 Increments version number
3. 📝 Generates changelog from git commits
4. 💾 Updates `ota-version.json`
5. 🚀 Publishes to EAS

## Key Features

### Version Strategies

Choose how versions increment:

- **`build`** (default) — `1.0.0-prod.42` → `1.0.0-prod.43`
- **`semver`** — `1.0.0-prod.42` → `1.0.1-prod.43`
- **`date`** — `1.0.0-prod.20250107`

### Changelog Sources

Auto-generate from multiple sources:

- **Git commits** (default) — Last N commits
- **Manual input** — Interactive prompts
- **File** — Read from CHANGELOG.md
- **Custom** — Via hooks

### Interactive Mode

```bash
npx ota-publish --interactive
```

Guided prompts for:
- Channel selection
- Changelog input
- Publish confirmation

### Dry Run

```bash
npx ota-publish --channel production --dry-run
```

Preview changes without publishing.

### Hooks System

Run custom logic at different stages:

```javascript
hooks: {
  beforePublish: async (version) => {
    // Run tests, linting
  },
  afterPublish: async (version) => {
    // Send notifications
  }
}
```

## Quick Start

### 1. Initialize

```bash
npx ota-publish init
```

Creates `ota-updates.config.js` in your project root.

### 2. Configure

```javascript
// ota-updates.config.js
export default {
  versionStrategy: 'build',
  changelog: {
    source: 'git',
    commitCount: 10,
  },
  channels: ['development', 'preview', 'production'],
}
```

### 3. Publish

```bash
# Development
npx ota-publish --channel development

# Production
npx ota-publish --channel production
```

## npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "ota:dev": "npx ota-publish --channel development",
    "ota:preview": "npx ota-publish --channel preview",
    "ota:prod": "npx ota-publish --channel production"
  }
}
```

Then run:

```bash
npm run ota:dev
npm run ota:preview
npm run ota:prod
```

## Next Steps

- [Learn all commands](/cli/commands)
- [Configure the CLI](/cli/configuration)
- [Use hooks](/guides/hooks)
