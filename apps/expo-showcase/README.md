# Expo Fancy OTA Showcase

A clean Expo Router tabs app that demonstrates `@ddedic/expo-fancy-ota-updates` in a real UI.

## Run

```bash
pnpm install
pnpm --filter @ddedic/expo-fancy-ota-showcase start
```

## Structure

- `app/` contains the Expo Router routes only.
- `src/` contains screens, UI components, theme, and provider shells.

## Notes

- Uses Expo Go by default.
- OTA checks are skipped in `__DEV__`, but the simulation controls still work.
