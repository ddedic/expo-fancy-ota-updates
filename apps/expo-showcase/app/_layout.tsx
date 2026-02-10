import { Stack } from 'expo-router/stack';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OTAProviderShell } from '@/ota/ota-provider-shell';
import { ShowcaseSettingsProvider } from '@/ota/showcase-settings-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ShowcaseSettingsProvider>
        <OTAProviderShell>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="info"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
        </OTAProviderShell>
      </ShowcaseSettingsProvider>
    </SafeAreaProvider>
  );
}
