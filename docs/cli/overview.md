# CLI Overview

## What is `ota-publish`?

`ota-publish` is a command-line tool that automates the entire OTA (Over-The-Air) update workflow for Expo apps. Instead of manually bumping versions, writing changelogs, and running `eas update`, you run a single command:

```bash
npx ota-publish --channel production
```

The tool handles everything else — version tracking, changelog generation, and EAS publishing.

## Why do I need this?

When you ship OTA updates with Expo, you typically need to:

1. Decide on a version number for the update
2. Write a changelog describing what changed
3. Update a version file so your app can display "v1.2.3"
4. Run `eas update` with the right channel and message
5. Repeat this for every update across multiple channels (development, preview, production)

`ota-publish` automates all of these steps. It also connects directly to the UI components in this package — the version and changelog it generates are what `UpdateBanner` and `OTAInfoScreen` display to your users.

## How it works

```
ota-version.json     ──→  ota-publish  ──→  EAS Update
(tracks version)          (automates)       (delivers to devices)
        │                      │
        └───── Your app reads this file ─────→ UpdateBanner shows
               via versionData prop            version + changelog
```

When you run `ota-publish --channel production`:

1. **Reads** your `ota-version.json` to get the current version
2. **Generates** a changelog (from git commits, manual input, file, or custom hook)
3. **Computes** the next version number using your chosen strategy
4. **Writes** the updated `ota-version.json` back to disk
5. **Publishes** the update via `eas update`
6. **Runs** any hooks you've configured (notifications, CI triggers, etc.)

Your app imports `ota-version.json` and passes it to `OTAUpdatesProvider` — so the banner and info screen always show the correct version and changelog.

## Prerequisites

Before using the CLI, make sure you have:

- **EAS CLI** installed (`npm install -g eas-cli`)
- **expo-updates** configured in your `app.json`
- **A git repository** initialized (if using `changelog.source: 'git'`)
- **An EAS project** linked (`eas init`)

## Quick Start

```bash
# 1. Create a config file with sensible defaults
npx ota-publish init

# 2. Publish an update to development
npx ota-publish --channel development

# 3. When ready, promote to production
npx ota-publish --channel production

# 4. Need to rollback? Revert safely
npx ota-publish revert --channel production

# 5. Or promote a tested update between channels
npx ota-publish promote --from preview --to production
```

::: tip Always preview first
Use `--dry-run` on any command to see what would happen without making changes:
```bash
npx ota-publish --channel production --dry-run
```
:::

## Commands at a glance

| Command | What it does |
|---------|-------------|
| `ota-publish --channel <ch>` | Publish an OTA update to a channel |
| `ota-publish init` | Create a starter config file |
| `ota-publish revert --channel <ch>` | Roll back a channel to a previous update |
| `ota-publish promote --from <ch> --to <ch>` | Copy an update from one channel to another |

## Version Strategies

Control how version numbers are generated:

| Strategy | Behavior | Example output |
|----------|----------|---------------|
| `build` (default) | Increment build number only | `1.0.0-production.42` |
| `semver` | Auto-increment patch + build | `1.0.1-production.43` |
| `date` | Use date-based timestamp | `1.0.0-20260211` |
| `custom` | Your own logic via `hooks.generateVersion` | Whatever you return |

## Changelog Sources

Control where changelog entries come from:

| Source | Behavior |
|--------|----------|
| `git` (default) | Auto-generated from recent git commits |
| `manual` | Interactive prompt asks you to type entries |
| `file` | Read from a file (e.g. `CHANGELOG.md`) |
| `custom` | Your own logic via `hooks.generateChangelog` |

## Channel Aliases

If version strings like `1.0.0-production.42` are too long, use aliases:

```javascript
// ota-updates.config.mjs
export default {
  channelAliases: { production: 'p', preview: 'pr' },
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },
};
```

Result: `1.0.0-p42`

## Next Steps

- [Commands Reference](/cli/commands) — All options and flags
- [Configuration Reference](/cli/configuration) — Full config file options
- [Hooks System](/guides/hooks) — Custom logic before/after publish
- [Complete Workflow](/examples/workflow) — End-to-end example with CLI + UI
