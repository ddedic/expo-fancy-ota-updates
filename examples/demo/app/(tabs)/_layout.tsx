import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { SFIcon } from '@/components/sf-icon';
import { useShowcaseSettings } from '@/ota/showcase-settings-context';

export default function TabsLayout() {
  const { palette } = useShowcaseSettings();
  const isIOS = Platform.OS === 'ios';
  const rawVersion = Platform.Version;
  const iosMajorVersion =
    typeof rawVersion === 'string' ? Number.parseInt(rawVersion, 10) : Number(rawVersion);
  const supportsNativeTabs = !isIOS || iosMajorVersion >= 21;
  const supportsMinimizeBehavior =
    isIOS && iosMajorVersion >= 26 && process.env.EXPO_PUBLIC_ENABLE_NATIVE_TAB_MINIMIZE === '1';

  if (!supportsNativeTabs) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: palette.textFaint,
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.border,
          },
        }}
      >
        <Tabs.Screen
          name="(banner)"
          options={{
            title: 'Live Demo',
            tabBarIcon: ({ color }) => (
              <SFIcon sf="rectangle.and.text.magnifyingglass" fallback="list-alt" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(info)"
          options={{
            title: 'Info Screen',
            tabBarIcon: ({ color }) => <SFIcon sf="info.circle" fallback="info-circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(customize)"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <SFIcon sf="paintbrush" fallback="paint-brush" color={color} />,
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      tintColor={palette.accent}
      minimizeBehavior={supportsMinimizeBehavior ? 'onScrollDown' : undefined}
    >
      <NativeTabs.Trigger name="(banner)">
        <Label>Live Demo</Label>
        <Icon sf={{ default: 'rectangle.and.text.magnifyingglass', selected: 'rectangle.and.text.magnifyingglass' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(info)">
        <Label>Info Screen</Label>
        <Icon sf="info.circle" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(customize)">
        <Label>Settings</Label>
        <Icon sf="paintbrush" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
