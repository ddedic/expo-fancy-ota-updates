import type { OTAVersionData } from '@ddedic/expo-fancy-ota-updates';

export const versionData: OTAVersionData = {
  version: '1.5.0',
  buildNumber: 43,
  releaseDate: new Date().toISOString(),
  changelog: [
    'Runtime channel switching — switch update channels at runtime.',
    'Refined update banner animations for Expo SDK 54.',
    'Added info screen hooks + theming support for custom layouts.',
  ],
};
