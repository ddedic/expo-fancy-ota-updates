# CLI Overview

`ota-publish` automates OTA versioning, changelog generation, and EAS publishing.

## Core Flow

```bash
npx ota-publish --channel production
```

The command:

1. reads `ota-version.json`
2. computes next version
3. builds changelog
4. writes updated version metadata
5. publishes with `eas update`

## What Is New

- Real `custom` version strategy via `hooks.generateVersion`
- Real `custom` changelog source via `hooks.generateChangelog`
- Per-channel version and message templates
- Channel aliases for compact version strings (`{channelAlias}`)
- Hook result overrides from `beforePublish` (changelog, message, version)
- CLI one-off overrides (`--strategy`, `--version-format`, `--platform`)
- New release management commands: `revert` and `promote`
- Better config validation for invalid channel mappings
- Safe-by-default release flow with confirm prompts and `--dry-run`

## Versioning Options

- `build` (default)
- `semver`
- `date`
- `custom`

Example compact production version:

```javascript
export default {
  channelAliases: { production: 'p' },
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },
};
```

## Changelog Sources

- `git`
- `manual`
- `file`
- `custom`

## Quick Start

```bash
npx ota-publish init
npx ota-publish --channel development
npx ota-publish promote --from preview --to production --dry-run
```

## Next

- [Commands](/cli/commands)
- [Configuration](/cli/configuration)
- [Hooks](/guides/hooks)
