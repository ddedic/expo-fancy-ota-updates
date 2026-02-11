import { Stack } from 'expo-router';

import { ControlsScreen } from '@/features/controls/controls-screen';

export default function CustomizationsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'UI Customizations' }} />
      <ControlsScreen />
    </>
  );
}
