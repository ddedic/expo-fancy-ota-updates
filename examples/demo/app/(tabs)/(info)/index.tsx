import { Stack } from 'expo-router';

import { InfoScreen } from '@/features/info/info-screen';

export default function InfoTabRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Info Screen' }} />
      <InfoScreen />
    </>
  );
}
