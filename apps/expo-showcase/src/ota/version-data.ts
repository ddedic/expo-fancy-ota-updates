import type { OTAVersionData } from '@ddedic/expo-fancy-ota-updates';

export const versionData: OTAVersionData = {
  version: '1.4.0',
  buildNumber: 42,
  releaseDate: new Date().toISOString(),
  changelog: [
    'Refined update banner animations for Expo SDK 54.',
    'Added info screen hooks + theming support for custom layouts.',
    'Improved simulation controls and telemetry data surface.',
  ],
};
