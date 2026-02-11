import { useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, Switch, Text, View } from 'react-native';
import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';
import { ScreenView } from '@/components/screen-view';
import { SectionCard } from '@/components/section-card';

function ToggleRow({
  label,
  value,
  onToggle,
  helper,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  helper?: string;
}) {
  const { palette } = useShowcaseSettings();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: palette.text, fontSize: 14, fontWeight: '600' }} selectable>
          {label}
        </Text>
        {helper ? (
          <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '500' }} selectable>
            {helper}
          </Text>
        ) : null}
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

const CHANNELS = ['production', 'staging', 'preview'] as const;

function ChannelSurfingSection({ palette }: { palette: ReturnType<typeof useShowcaseSettings>['palette'] }) {
  const { channel, isSwitchingChannel, switchChannel } = useOTAUpdates();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const handleSwitch = async (name: string) => {
    setActiveChannel(name);
    const result = await switchChannel(name);
    setActiveChannel(null);

    if (result.isSkipped) {
      Alert.alert('Channel switch skipped', result.reason ?? 'Unknown reason');
    } else if (result.error) {
      Alert.alert('Channel switch failed', result.error.message);
    }
  };

  return (
    <SectionCard
      palette={palette}
      title="Channel surfing"
      subtitle="Switch the update channel this app pulls from at runtime."
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '600' }}>
          Current channel:
        </Text>
        <Text style={{ color: palette.text, fontSize: 12, fontWeight: '700' }}>
          {channel ?? 'N/A'}
        </Text>
        {isSwitchingChannel && <ActivityIndicator size="small" />}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {CHANNELS.map((name) => {
          const isActive = channel === name;
          const isSwitching = activeChannel === name;
          return (
            <Pressable
              key={name}
              onPress={() => handleSwitch(name)}
              disabled={isSwitchingChannel}
              style={{
                flex: 1,
                borderRadius: 12,
                borderCurve: 'continuous',
                paddingVertical: 12,
                backgroundColor: isActive ? palette.accent : palette.surfaceMuted,
                opacity: isSwitchingChannel && !isSwitching ? 0.5 : 1,
              }}
            >
              {isSwitching ? (
                <ActivityIndicator size="small" color={isActive ? '#ffffff' : palette.text} />
              ) : (
                <Text
                  style={{
                    color: isActive ? '#ffffff' : palette.text,
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                  selectable
                >
                  {name}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

export function ControlsScreen() {
  const {
    palette,
    infoMode,
    setInfoMode,
    useCustomBanner,
    useCustomInfoRenderer,
    toggleCustomBanner,
    toggleCustomInfoRenderer,
  } = useShowcaseSettings();

  return (
    <ScreenView palette={palette}>
      <SectionCard
        palette={palette}
        title="Customization"
        subtitle="Swap the built-in UI with your own renderers."
      >
        <ToggleRow
          label="Use custom banner style"
          value={useCustomBanner}
          onToggle={toggleCustomBanner}
          helper="Switch between default banner and your branded banner renderer."
        />
        <ToggleRow
          label="Use custom info layout"
          value={useCustomInfoRenderer}
          onToggle={toggleCustomInfoRenderer}
          helper="Replace the default info block with a compact custom layout."
        />
      </SectionCard>

      <SectionCard
        palette={palette}
        title="Info screen mode"
        subtitle="Switch between the end-user view and the full developer view."
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setInfoMode('user')}
            style={{
              flex: 1,
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingVertical: 12,
              backgroundColor: infoMode === 'user' ? palette.accent : palette.surfaceMuted,
            }}
          >
            <Text
              style={{
                color: infoMode === 'user' ? '#ffffff' : palette.text,
                fontWeight: '700',
                textAlign: 'center',
                fontSize: 13,
              }}
              selectable
            >
              End user
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setInfoMode('developer')}
            style={{
              flex: 1,
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingVertical: 12,
              backgroundColor: infoMode === 'developer' ? palette.accent : palette.surfaceMuted,
            }}
          >
            <Text
              style={{
                color: infoMode === 'developer' ? '#ffffff' : palette.text,
                fontWeight: '700',
                textAlign: 'center',
                fontSize: 13,
              }}
              selectable
            >
              Developer
            </Text>
          </Pressable>
        </View>
      </SectionCard>

      <ChannelSurfingSection palette={palette} />

      <SectionCard
        palette={palette}
        title="Diagnostics"
        subtitle="Inspect runtime values and internal state."
      >
        <Link href="/(tabs)/(customize)/advanced" asChild>
          <Pressable
            style={{
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: palette.surfaceMuted,
              borderColor: palette.border,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: palette.text, fontWeight: '700', fontSize: 13 }} selectable>
              Open advanced diagnostics
            </Text>
          </Pressable>
        </Link>
      </SectionCard>
    </ScreenView>
  );
}
