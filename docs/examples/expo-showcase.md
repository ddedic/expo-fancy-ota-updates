# Expo Showcase Demo

> This is the public hands-on demo app for the package.

Run a full Expo application that demonstrates package UI, runtime behavior, and customization with a clean, production-style structure.

## Location

- Repo path: `examples/demo`

## What You Can Feel Immediately

- Expo Router tabs (`Info Screen`, `Banner Demo`, `Customize`) with TypeScript
- Default `UpdateBanner` plus a custom banner renderer toggle
- `OTAInfoScreen` in both tab and modal usage patterns
- `useOTAUpdates()` telemetry with status, metadata, and action triggers
- **Channel surfing** — interactive runtime channel switching UI (production/staging/preview)
- Controls to toggle banner/info overrides and simulate update states
- Native-tabs compatibility strategy with fallback tabs for unsupported/unstable iOS ranges
- Header coordination patterns to avoid double-header and content-overlap issues

This demo is intentionally tuned to surface real integration edge cases early (header coordination, safe-area behavior, and tab compatibility) so production apps can adopt safer defaults.

## Screenshots

<table>
<tbody>
<tr>
<td width="33%" align="center">
  <img src="/expo-example/example-1-live-demo.png" alt="Live Demo" width="100%" />
  <br/>
  <sub><b>Live Demo</b> — Banner, status, and lifecycle controls</sub>
</td>
<td width="33%" align="center">
  <img src="/expo-example/example-2-info-screen.png" alt="Info Screen" width="100%" />
  <br/>
  <sub><b>Info Screen</b> — Version details and update actions</sub>
</td>
<td width="33%" align="center">
  <img src="/expo-example/example-3-settings.png" alt="Settings" width="100%" />
  <br/>
  <sub><b>Settings</b> — Customization and channel surfing</sub>
</td>
</tr>
</tbody>
</table>

## Structure

- `app/`: route files only
- `src/ota/`: provider shell, settings context, palettes, translations
- `src/features/`: feature-level screen composition
- `src/components/`: reusable UI building blocks

## Run Locally

```bash
pnpm install
pnpm --dir examples/demo start
```

Then open with Expo Go or simulator.

## Expo SDK

This demo targets **Expo SDK 54** (latest stable at implementation time).

## Local Package vs Published Package

By default, the showcase uses the local package from this repository:

```json
"@ddedic/expo-fancy-ota-updates": "file:../.."
```

If you want to verify against npm instead, replace it with:

```json
"@ddedic/expo-fancy-ota-updates": "^1.5.0"
```

## Next Steps

- [Complete Workflow](/examples/workflow)
- [Custom UI](/examples/custom-ui)
- [OTAUpdatesProvider](/ui-components/provider)
