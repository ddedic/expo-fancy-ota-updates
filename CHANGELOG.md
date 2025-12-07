# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [Unreleased]

### Planned
- Rollback command to revert to previous version
- Promote command to copy updates between channels
- GitHub Actions workflow examples
- More version format templates
- Custom version strategy support
