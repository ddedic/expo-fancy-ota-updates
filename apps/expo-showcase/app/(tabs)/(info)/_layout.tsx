import { Stack } from 'expo-router/stack';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function InfoLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Info Screen',
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: palette.text },
        headerLargeTitle: false,
        contentStyle: { backgroundColor: palette.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
