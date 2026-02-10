# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added a full Expo showcase app at `apps/expo-showcase` (Expo SDK 54) to demo package UI/runtime behavior end-to-end.
- Added a dedicated docs page for the showcase demo at `/apps/expo-showcase`.

### Changed
- Updated docs and README to reference the Expo showcase demo from all major sections.

## [1.4.1] - 2026-02-10

### Fixed
- Improved `OTAInfoScreen` update ID resolution:
  - uses `Updates.updateId` when available
  - falls back to `Updates.manifest.id` when `updateId` is `null` in dev/client environments
- Improved `Update ID` display in `OTAUpdateInfo`:
  - shows a compact `prefix...suffix` format when available
  - shows `N/A (dev build)` in development when no update ID is exposed by runtime
- Improved `OTAInfoScreen` scroll inset handling in tab navigators:
  - enabled automatic content and indicator inset adjustment
  - increased bottom content padding for tab-hosted usage to avoid tab bar overlap

### Changed
- Documented native navigation integration constraints for `OTAInfoScreen`:
  - avoid rendering two headers at once (native stack + internal screen header)
  - use standard native header mode for `OTAInfoScreen` in tab routes
  - prefer fallback tabs on platforms/versions where native tabs features are unstable

## [1.4.0] - 2026-02-10

### Added
- Added `ota-publish revert` command to rollback a channel by republishing a previous update group.
- Added `ota-publish promote` command to copy update groups between channels (e.g. `preview -> production`).
- Added strict safety defaults for release-management commands:
  - interactive group selection when `--group` is not provided
  - confirmation prompts by default
  - `--dry-run` preview support
  - `--yes` override to skip confirmation
- Added runtime metadata field `lastSkippedReason` to `useOTAUpdates()` context.
- Added provider config `recordSkippedChecks` to control skipped-check metadata recording.

### Changed
- `checkForUpdate()` now records skipped checks more predictably (optional `lastCheck` update + skip reason) without breaking status semantics.
- `UpdateBanner` now works without `expo-linear-gradient` by using an automatic solid `View` fallback.
- Updated docs and examples for new commands, skipped-check behavior, and gradient fallback.
- Updated Photo Trim App Store link to `https://apps.apple.com/app/id6755884114`.

## [1.3.0] - 2026-02-10

### Added
- Implemented real `versionStrategy: "custom"` with `hooks.generateVersion`.
- Implemented real `changelog.source: "custom"` with `hooks.generateChangelog`.
- Added channel-aware template options:
  - `versionFormatByChannel`
  - `eas.messageFormatByChannel`
  - `channelAliases` with `{channelAlias}` placeholder support.
- Added CLI one-off overrides:
  - `--strategy`
  - `--version-format`
  - repeatable `--platform`.
- Added `beforePublish` override return support for `changelog`, `message`, and `version`.
- Added typed CLI hook/context exports:
  - `OTAHooks`, `BeforePublishContext`, `BeforePublishResult`, `AfterPublishContext`, `ErrorContext`, `CustomVersionContext`, `CustomChangelogContext`, `VersionTemplateVariables`.
- Added provider config `minCheckIntervalMs` for throttled update checks.

### Changed
- Replaced single-token string replacement with template rendering that handles repeated placeholders safely.
- Resolved `changelog.filePath` relative to project/config cwd.
- Strengthened CLI config validation (channel map keys, `defaultChannel`, `filePath` requirement, `custom` hook requirements).
- Expanded `ota-publish init` template to include dynamic versioning/changelog examples.
- Updated docs and CLI references across `/docs`, `README.md`, and `CLI.md`.

## [1.2.1] - 2025-12-08

### Added
- **Enhanced Render Props**: `renderInfo`, `renderActions`, and `renderChangelog` now receive comprehensive prop objects (`RenderInfoProps`, `RenderActionsProps`, etc.) containing all necessary state and callbacks (e.g., `checkForUpdate`, `status`, `otaVersion`).
- **Controlled Components**: `OTAUpdateInfo`, `OTAUpdateActions`, and `OTAUpdateChangelog` now accept partial props to override context values, enabling full customization.

### Changed
- **Documentation**: Added detailed "Customization" guide to `info-screen.md` with examples for custom components and render props.
- **Documentation**: Optimized screenshot size in docs for better readability.

### Fixed
- **Types**: Exported `RenderInfoProps`, `RenderActionsProps`, `RenderChangelogProps` from main package.

### Added
- **Refactored Architecture**: Split `OTAInfoScreen` into modular, exported sub-components (`OTAUpdateInfo`, `OTAUpdateActions`, `OTAUpdateChangelog`).
- **Render Props**: Added `renderInfo`, `renderActions`, `renderChangelog` for full UI customization.
- **Mode Support**: Added `mode` prop ('developer' | 'user') to `OTAInfoScreen` to toggle between debug-heavy and user-friendly views.
- **Improved Feedback**: Added native alerts for "Check for Update" results (Available, Up to Date, Error, Skipped).
- **Simulation Mode**: Added `simulateUpdate()` debug action to test update flows without a real update.
- **Granular Control**: Added explicit visibility props (`showRuntimeVersion`, `showUpdateId`, etc.) to toggle individual info rows.
- **Enhanced UI**: Completely redesigned with a modern card-based layout, grouped info sections, and distinct action buttons.

### Changed
- **Accessibility**: Moved critical Action Buttons and Debug tools *above* the Changelog section to eliminate scrolling.
- **Visuals**: improved spacing, typography, and section separation.

### Fixed
- **Fixed missing `downloading` status in TypeScript definitions.**

## [1.1.5] - 2025-12-07

### Fixed
- Fixed documentation home page layout features section.
- Updated README with clearer global CLI usage instructions.

## [1.1.4] - 2025-12-07

### Fixed
- Added missing `bin` field to `package.json` to properly link `ota-publish` executable.
- Fixed `command not found` error when running via `npx`.

## [1.1.3] - 2025-12-07

### Added
- **Documentation Site**: Launched comprehensive [VitePress documentation](https://ddedic.github.io/expo-fancy-ota-updates/).
  - 15+ pages covering Guides, UI Components, CLI, and Examples.
  - Search functionality and mobile responsive design.
- **Screenshots**: Added visual showcase for UI components in README and Docs.
- **GitHub Actions**: Automated workflow to deploy documentation to GitHub Pages on push.
- **Marketing**: Added `MARKETING.md` with social media assets.

### Changed
- Updated `README.md` with dedicated documentation section and improved navigation.
- Removed Photo Trim logo from global docs navigation (now in sponsor section).

## [1.1.0] - 2025-12-07

### Changed
- Initial npm release.
- Updated package exports for better ESM/CJS compatibility.

## [1.0.0] - 2025-12-07

### Added

#### UI Components
- `OTAUpdatesProvider` context provider with state management
- `UpdateBanner` animated component with gradient and pulse animation
- `OTAInfoScreen` full debug/info screen with changelog display
- `useOTAUpdates` hook for accessing update state and actions
- Full theming support with dark and light presets
- i18n support with customizable translations
- Render props for component customization
- Icon support using lucide-react-native with text fallbacks
- Auto-check on mount and foreground
- Debug `simulateUpdate()` function for testing

#### CLI Publishing Tool
- `ota-publish` CLI command for publishing OTA updates
- `ota-publish init` command to initialize configuration
- Configuration system using cosmiconfig (supports `.js`, `.mjs`, `.json`)
- Zod schema validation for type-safe configuration
- Multiple version strategies:
  - `build` — Increment build number only (default)
  - `semver` — Auto-increment patch version
  - `date` — Date-based versioning
- Multiple changelog sources:
  - `git` — Auto-generate from git commits (default)
  - `manual` — Interactive prompts
  - `file` — Read from CHANGELOG.md or custom file
- Interactive mode with prompts (`--interactive`)
- Dry-run support (`--dry-run`)
- Custom changelog messages (`--message`)
- Hooks system for custom logic:
  - `beforePublish` — Run before publishing
  - `afterPublish` — Run after successful publish
  - `onError` — Handle publish errors
- EAS integration with automatic publishing
- Multi-channel support (development, preview, production)
- Beautiful CLI output with colors and spinners

### Documentation
- Comprehensive README with usage examples
- Separate CLI documentation (CLI.md)
- TypeScript type definitions
- MIT License
- Marketing section featuring Photo Trim app

### Build & Distribution
- Dual build output (CJS + ESM) for UI components
- ESM build for CLI tool
- TypeScript declarations (.d.ts)
- Executable bin wrapper
- Proper package.json exports configuration

### Planned
- Rollback command to revert to previous version
- Promote command to copy updates between channels
- GitHub Actions workflow examples
- More version format templates
- Custom version strategy support

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/apps/expo-showcase).
