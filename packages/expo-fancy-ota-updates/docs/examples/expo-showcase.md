# Expo Showcase Demo

> This is the public hands-on demo app for the package.

Run a full Expo application that demonstrates package UI, runtime behavior, and customization with a clean, production-style structure.

## Location

- Repo path: `apps/expo-showcase`

## What You Can Feel Immediately

- Expo Router tabs (`Info Screen`, `Banner Demo`, `Customize`) with TypeScript
- Default `UpdateBanner` plus a custom banner renderer toggle
- `OTAInfoScreen` in both tab and modal usage patterns
- `useOTAUpdates()` telemetry with status, metadata, and action triggers
- Controls to toggle banner/info overrides and simulate update states
- Native-tabs compatibility strategy with fallback tabs for unsupported/unstable iOS ranges
- Header coordination patterns to avoid double-header and content-overlap issues

This demo is intentionally tuned to surface real integration edge cases early (header coordination, safe-area behavior, and tab compatibility) so production apps can adopt safer defaults.

## Structure

- `app/`: route files only
- `src/ota/`: provider shell, settings context, palettes, translations
- `src/features/`: feature-level screen composition
- `src/components/`: reusable UI building blocks

## Run Locally

```bash
pnpm install
pnpm --filter @ddedic/expo-fancy-ota-showcase start
```

Then open with Expo Go or simulator.

## Expo SDK

This demo targets **Expo SDK 54** (latest stable at implementation time).

## Local Package vs Published Package

By default, the showcase uses the local workspace package:

```json
"@ddedic/expo-fancy-ota-updates": "workspace:*"
```

If you want to verify against npm instead, replace it with:

```json
"@ddedic/expo-fancy-ota-updates": "^1.4.1"
```

## Next Steps

- [Complete Workflow](/examples/workflow)
- [Custom UI](/examples/custom-ui)
- [OTAUpdatesProvider](/ui-components/provider)
