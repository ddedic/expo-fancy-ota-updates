import { Stack } from 'expo-router/stack';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function BannerLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Banner Demo',
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: { color: palette.text },
        headerLargeTitleStyle: { color: palette.text },
        headerLargeTitle: true,
        contentStyle: { backgroundColor: palette.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
