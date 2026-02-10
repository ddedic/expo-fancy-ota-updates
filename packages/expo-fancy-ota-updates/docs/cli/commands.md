# CLI Commands

Reference for `ota-publish`.

## `ota-publish` (default publish command)

### Usage

```bash
ota-publish [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--channel <channel>` | `-c` | Target channel |
| `--message <message>` | `-m` | Override publish message/changelog with one custom message |
| `--strategy <strategy>` | `-s` | Override version strategy for this run (`build`, `semver`, `date`, `custom`) |
| `--version-format <template>` | | Override version template for this run |
| `--platform <platform>` | `-p` | Target platform (`ios` or `android`), repeat for both |
| `--dry-run` | | Preview actions without file writes or EAS publish |
| `--no-increment` | | Keep current version/build, update changelog/message flow only |
| `--interactive` | `-i` | Guided prompts |

### Examples

```bash
# Basic publish
ota-publish --channel production

# Compact one-off version format
ota-publish --channel production --version-format "{major}.{minor}.{patch}-p{build}"

# One-off strategy override
ota-publish --channel preview --strategy semver

# Single platform publish
ota-publish --channel production --platform ios

# Multi-platform explicit publish
ota-publish --channel production --platform ios --platform android

# Dry run
ota-publish --channel production --dry-run
```

### Execution Flow

1. Loads `ota-updates.config.*`.
2. Validates channels, strategy, and platform inputs.
3. Reads current `ota-version.json`.
4. Generates changelog from configured source.
5. Runs `hooks.beforePublish` (can override changelog/message/version).
6. Computes next version via strategy/template.
7. Writes `ota-version.json` (unless dry-run).
8. Publishes to EAS (if `eas.autoPublish`).
9. Runs `hooks.afterPublish`.
10. Runs `hooks.onError` on failure.

## `ota-publish init`

### Usage

```bash
ota-publish init
```

### What It Does

Creates `ota-updates.config.js` in the current project with:

- new dynamic version options (`versionFormatByChannel`, `channelAliases`)
- per-channel EAS message templates
- custom hook examples for version/changelog generation

## `ota-publish revert`

Republish a previous update group to a channel (rollback).

### Usage

```bash
ota-publish revert --channel <channel> [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--channel <channel>` | `-c` | Channel to roll back |
| `--group <groupId>` | `-g` | Update group ID (optional, otherwise interactive picker) |
| `--message <message>` | `-m` | Republish message |
| `--platform <platform>` | `-p` | `ios`, `android`, or `all` |
| `--dry-run` | | Preview only |
| `--yes` | `-y` | Skip confirmation prompt |

### Semantics

- Source updates are selected from the branch currently linked to the channel.
- Group picker shows runtime version and timestamp to reduce accidental rollbacks.
- Without `--group`, command is interactive by default.

### Examples

```bash
# Interactive rollback (choose group from recent updates)
ota-publish revert --channel production

# Explicit group rollback
ota-publish revert --channel production --group 00000000-0000-0000-0000-000000000000

# Safe preview first
ota-publish revert --channel production --dry-run
```

## `ota-publish promote`

Copy an update group from one channel to another (for example `preview -> production`).

### Usage

```bash
ota-publish promote --from <channel> --to <channel> [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--from <channel>` | | Source channel |
| `--to <channel>` | | Destination channel |
| `--group <groupId>` | `-g` | Update group ID (optional, otherwise interactive picker) |
| `--message <message>` | `-m` | Republish message |
| `--platform <platform>` | `-p` | `ios`, `android`, or `all` |
| `--dry-run` | | Preview only |
| `--yes` | `-y` | Skip confirmation prompt |

### Semantics

- Source group is selected from the branch linked to `--from` channel.
- Republish target is `--to` channel.
- Command blocks `--from` equal to `--to`.

### Examples

```bash
# Interactive promote (choose source update group)
ota-publish promote --from preview --to production

# Explicit group promote
ota-publish promote --from preview --to production --group 00000000-0000-0000-0000-000000000000

# Safe preview first
ota-publish promote --from preview --to production --dry-run
```

## Interactive Mode

```bash
ota-publish --interactive
```

Prompts for:

1. channel
2. changelog source preference (git vs message)
3. custom message (optional)
4. final confirmation

## npm Scripts

```json
{
  "scripts": {
    "ota:dev": "ota-publish --channel development",
    "ota:preview": "ota-publish --channel preview",
    "ota:prod": "ota-publish --channel production",
    "ota:revert:prod": "ota-publish revert --channel production",
    "ota:promote:preview-to-prod": "ota-publish promote --from preview --to production",
    "ota:prod:ios": "ota-publish --channel production --platform ios",
    "ota:prod:dry": "ota-publish --channel production --dry-run"
  }
}
```

## Next Steps

- [Configuration Options](/cli/configuration)
- [Hooks System](/guides/hooks)
- [Complete Workflow](/examples/workflow)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/apps/expo-showcase).
