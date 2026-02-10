import { Link } from 'expo-router';
import { Pressable, Switch, Text, View } from 'react-native';

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
        title="Visual style options"
        subtitle="Toggle the packaged UI and your custom renderers."
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
        title="Info screen audience"
        subtitle="Choose which experience to preview in the info screen."
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

      <SectionCard
        palette={palette}
        title="Advanced tools"
        subtitle="Diagnostics are available, but kept separate from the main demo flow."
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
