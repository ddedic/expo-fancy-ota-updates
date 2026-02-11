import { Stack } from 'expo-router/stack';

import { InfoLinkButton } from '@/components/info-link-button';
import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function ControlsLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: palette.text },
        headerBackButtonDisplayMode: 'minimal',
        headerRight: () => <InfoLinkButton palette={palette} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Controls' }} />
    </Stack>
  );
}
