import { Stack } from 'expo-router/stack';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function CustomizeLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'UI Customizations',
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
      <Stack.Screen name="advanced" options={{ title: 'Advanced Diagnostics', headerLargeTitle: false }} />
    </Stack>
  );
}
