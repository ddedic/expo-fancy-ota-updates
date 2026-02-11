# CLI Publishing Tool

`ota-publish` automates OTA update publishing for Expo apps. A single command bumps the version, generates a changelog, updates `ota-version.json`, and runs `eas update` — so your app's `UpdateBanner` and `OTAInfoScreen` always show the right version and changelog.

For the full documentation, see the [CLI docs site](https://ddedic.github.io/expo-fancy-ota-updates/cli/overview).

## Quick Start

```bash
npx ota-publish init
npx ota-publish --channel development
```

## Publish Command

```bash
ota-publish [options]
```

### Options

- `-c, --channel <channel>` target channel
- `-m, --message <message>` override publish message/changelog
- `-s, --strategy <strategy>` one-off strategy override (`build`, `semver`, `date`, `custom`)
- `--version-format <template>` one-off version format override
- `-p, --platform <platform>` target `ios` or `android` (repeatable)
- `--dry-run` preview mode
- `--no-increment` keep existing version/build
- `-i, --interactive` guided prompts

## Revert Command

Rollback a channel by republishing a previous update group.

```bash
ota-publish revert --channel production
```

Options:

- `-c, --channel <channel>` channel to revert
- `-g, --group <groupId>` explicit update group ID (optional)
- `-m, --message <message>` republish message
- `-p, --platform <platform>` `ios`, `android`, or `all`
- `--dry-run` preview only
- `-y, --yes` skip confirmation prompt

Examples:

```bash
# Interactive picker from recent groups
ota-publish revert --channel production

# Explicit group
ota-publish revert --channel production --group 00000000-0000-0000-0000-000000000000

# Preview first
ota-publish revert --channel production --dry-run
```

Semantics:
- CLI resolves the channel's source branch and lists recent update groups.
- Group picker includes runtime/version context before confirmation.

## Promote Command

Copy an update group between channels (for example `preview -> production`).

```bash
ota-publish promote --from preview --to production
```

Options:

- `--from <channel>` source channel
- `--to <channel>` destination channel
- `-g, --group <groupId>` explicit update group ID (optional)
- `-m, --message <message>` republish message
- `-p, --platform <platform>` `ios`, `android`, or `all`
- `--dry-run` preview only
- `-y, --yes` skip confirmation prompt

Examples:

```bash
# Interactive picker from source channel groups
ota-publish promote --from preview --to production

# Explicit group
ota-publish promote --from preview --to production --group 00000000-0000-0000-0000-000000000000

# Preview first
ota-publish promote --from preview --to production --dry-run
```

Semantics:
- Source group comes from the branch linked to `--from`.
- Republish target is the branch linked to `--to`.

## Examples

```bash
# Basic
ota-publish --channel production

# Compact production format
ota-publish --channel production --version-format "{major}.{minor}.{patch}-p{build}"

# One-off strategy
ota-publish --channel preview --strategy semver

# Platform scoped
ota-publish --channel production --platform ios
ota-publish --channel production --platform ios --platform android

# Dry run
ota-publish --channel production --dry-run
```

## Config File

`ota-publish init` creates `ota-updates.config.js`:

```javascript
/**
 * @type {import('@ddedic/expo-fancy-ota-updates').OTAConfig}
 */
export default {
  versionFile: './ota-version.json',
  baseVersion: 'package.json',

  versionFormat: '{major}.{minor}.{patch}-{channelAlias}.{build}',
  versionFormatByChannel: {
    production: '{major}.{minor}.{patch}-p{build}',
  },
  versionStrategy: 'build',

  channelAliases: {
    development: 'd',
    preview: 'pr',
    production: 'p',
  },

  changelog: {
    source: 'git', // git | manual | file | custom
    commitCount: 10,
    format: 'short',
    includeAuthor: false,
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
      return { changelog };
    },
    generateVersion: async ({ defaultVersion }) => defaultVersion,
    generateChangelog: async () => ['Custom release note'],
    afterPublish: async (version, context) => {
      console.log(`Published ${version.version} with "${context.message}"`);
    },
    onError: async (error, context) => {
      console.error(`Publish failed in ${context.cwd}:`, error.message);
    },
  },
};
```

## Template Variables

Version templates:

- `{major}`
- `{minor}`
- `{patch}`
- `{channel}`
- `{channelAlias}`
- `{build}`
- `{timestamp}`

Message templates:

- `{version}`
- `{channel}`
- `{channelAlias}`
- `{build}`
- `{firstChange}`
- `{date}`

## Hooks

Available hooks:

- `beforePublish(context)` with override return support (`changelog`, `message`, `version`)
- `afterPublish(version, context)`
- `onError(error, context)`
- `generateVersion(context)` for `versionStrategy: 'custom'`
- `generateChangelog(context)` for `changelog.source: 'custom'`

## Recommended Scripts

```json
{
  "scripts": {
    "ota:dev": "ota-publish --channel development",
    "ota:preview": "ota-publish --channel preview",
    "ota:prod": "ota-publish --channel production",
    "ota:revert:prod": "ota-publish revert --channel production",
    "ota:promote:preview-to-prod": "ota-publish promote --from preview --to production",
    "ota:prod:dry": "ota-publish --channel production --dry-run",
    "ota:prod:ios": "ota-publish --channel production --platform ios"
  }
}
```
