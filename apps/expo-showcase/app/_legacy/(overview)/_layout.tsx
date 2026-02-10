import { Stack } from 'expo-router/stack';

import { InfoLinkButton } from '@/components/info-link-button';
import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function OverviewLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: { color: palette.text },
        headerLargeTitleStyle: { color: palette.text },
        headerLargeTitle: true,
        headerBackButtonDisplayMode: 'minimal',
        headerRight: () => <InfoLinkButton palette={palette} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Overview' }} />
    </Stack>
  );
}
