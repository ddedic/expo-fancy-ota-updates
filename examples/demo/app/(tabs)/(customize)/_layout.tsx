import { Stack } from 'expo-router/stack';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function CustomizeLayout() {
  const { palette } = useShowcaseSettings();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: palette.text },
        contentStyle: { backgroundColor: palette.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'UI Customizations' }} />
      <Stack.Screen name="advanced" options={{ title: 'Advanced Diagnostics' }} />
    </Stack>
  );
}
