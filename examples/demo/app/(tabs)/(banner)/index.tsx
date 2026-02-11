import { Stack } from 'expo-router';

import { OverviewScreen } from '@/features/overview/overview-screen';

export default function BannerDemoRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Banner Demo' }} />
      <OverviewScreen />
    </>
  );
}
