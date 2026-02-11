import { useEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

import { ScreenView } from '@/components/screen-view';
import { SectionCard } from '@/components/section-card';
import { StatusPill } from '@/components/status-pill';
import { useShowcaseSettings } from '@/ota/showcase-settings-context';
import { formatTimestamp } from '@/utils/format';

function ActionButton({
  title,
  onPress,
  variant = 'accent',
}: {
  title: string;
  onPress: () => void;
  variant?: 'accent' | 'outline';
}) {
  const { palette } = useShowcaseSettings();

  const style =
    variant === 'accent'
      ? {
          backgroundColor: palette.accent,
          borderColor: palette.accent,
          borderWidth: 1,
        }
      : {
          backgroundColor: 'transparent',
          borderColor: palette.accent,
          borderWidth: 1,
        };

  const textColor = variant === 'accent' ? '#ffffff' : palette.accent;

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 12,
        borderCurve: 'continuous',
        paddingHorizontal: 12,
        paddingVertical: 10,
        ...style,
        boxShadow: variant === 'accent' ? '0 10px 20px rgba(42, 91, 255, 0.25)' : undefined,
      }}
    >
      <Text style={{ color: textColor, fontWeight: '700', fontSize: 13 }} selectable>
        {title}
      </Text>
    </Pressable>
  );
}

function StateTile({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  const { palette } = useShowcaseSettings();

  return (
    <View
      style={{
        flex: 1,
        minWidth: 92,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: active ? palette.accent : palette.border,
        backgroundColor: active ? palette.accentSoft : palette.surfaceMuted,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 4,
      }}
    >
      <Text style={{ color: palette.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }} selectable>
        {label}
      </Text>
      <Text
        style={{
          color: active ? palette.accent : palette.textMuted,
          fontSize: 14,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}
        selectable
      >
        {active ? 'Active' : 'Idle'}
      </Text>
    </View>
  );
}

export function OverviewScreen() {
  const { palette } = useShowcaseSettings();
  const {
    status,
    isDownloading,
    isDownloaded,
    isUpdateAvailable,
    checkForUpdate,
    simulateUpdate,
    resetSimulation,
    otaVersion,
    lastCheck,
    lastSkippedReason,
  } = useOTAUpdates();

  useEffect(() => {
    simulateUpdate();
  }, []);

  async function handleCheckNow() {
    const result = await checkForUpdate();

    if (result.isSkipped) {
      Alert.alert('Not checked right now', result.reason || 'Check was skipped.');
      return;
    }

    if (result.error) {
      Alert.alert('Unable to check updates', result.error.message || 'Unknown error');
      return;
    }

    Alert.alert(
      result.isAvailable ? 'New update found' : 'You are up to date',
      result.isAvailable
        ? 'The banner can now guide users to download the update.'
        : 'No update is currently available.'
    );
  }

  return (
    <ScreenView
      palette={palette}
      header={
        <View
          style={{
            backgroundColor: palette.surface,
            borderWidth: 1,
            borderColor: palette.border,
            borderRadius: 24,
            borderCurve: 'continuous',
            padding: 16,
            overflow: 'hidden',
            gap: 10,
            boxShadow: '0 18px 36px rgba(15, 23, 42, 0.1)',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: 90,
              right: -35,
              top: -65,
              opacity: 0.25,
              backgroundColor: palette.accent,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              right: 50,
              bottom: -42,
              opacity: 0.2,
              backgroundColor: palette.accentSoft,
            }}
          />

          <Text
            style={{
              color: palette.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
            selectable
          >
            Expo Fancy OTA Updates
          </Text>

          <Text
            style={{
              color: palette.text,
              fontSize: 28,
              lineHeight: 34,
              fontWeight: '800',
              maxWidth: '90%',
            }}
            selectable
          >
            Beautiful OTA update flows, out of the box.
          </Text>

          <Text style={{ color: palette.textMuted, fontSize: 14, lineHeight: 20, fontWeight: '500' }} selectable>
            Animated banners, info screens, and full theming — ready to drop into any Expo app.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 13, fontWeight: '600' }} selectable>
              latest check: {formatTimestamp(lastCheck)}
            </Text>
            <StatusPill palette={palette} status={status} />
          </View>
        </View>
      }
    >
      <SectionCard
        palette={palette}
        title="Try it out"
        subtitle="Trigger each step of the update flow to see it live."
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <ActionButton title="Check for updates" onPress={handleCheckNow} />
          <ActionButton title="Preview available update" onPress={simulateUpdate} variant="outline" />
          <ActionButton title="Clear preview" onPress={resetSimulation} variant="outline" />
        </View>
      </SectionCard>

      <SectionCard
        palette={palette}
        title="Update lifecycle"
        subtitle="Real-time state of each phase in the update pipeline."
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <StateTile label="Update" active={isUpdateAvailable} />
          <StateTile label="Download" active={isDownloading} />
          <StateTile label="Restart" active={isDownloaded} />
        </View>

        <View
          style={{
            borderRadius: 12,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.surfaceMuted,
            padding: 12,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700' }} selectable>
              Demo target version
            </Text>
            <Text style={{ color: palette.text, fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] }} selectable>
              {otaVersion}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700' }} selectable>
              Last skipped reason
            </Text>
            <Text style={{ color: palette.text, fontSize: 12, fontWeight: '700', textAlign: 'right', flexShrink: 1 }} selectable>
              {lastSkippedReason || 'None'}
            </Text>
          </View>
        </View>
      </SectionCard>
    </ScreenView>
  );
}
