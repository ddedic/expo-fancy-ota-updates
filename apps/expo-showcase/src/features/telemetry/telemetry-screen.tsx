import { Text, View } from 'react-native';

import { useOTAUpdates } from '@ddedic/expo-fancy-ota-updates';

import { ScreenView } from '@/components/screen-view';
import { SectionCard } from '@/components/section-card';
import { useShowcaseSettings } from '@/ota/showcase-settings-context';

function TelemetryRow({ label, value }: { label: string; value: string }) {
  const { palette } = useShowcaseSettings();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '600' }} selectable>
        {label}
      </Text>
      <Text
        style={{
          color: palette.text,
          fontSize: 12,
          fontWeight: '700',
          textAlign: 'right',
          fontVariant: ['tabular-nums'],
        }}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

export function TelemetryScreen() {
  const { palette } = useShowcaseSettings();
  const {
    status,
    currentUpdateId,
    channel,
    runtimeVersion,
    isEmbeddedUpdate,
    isUpdateAvailable,
    isDownloading,
    isDownloaded,
    isSimulating,
  } = useOTAUpdates();

  return (
    <ScreenView palette={palette}>
      <SectionCard
        palette={palette}
        title="Runtime diagnostics"
        subtitle="Advanced values pulled directly from expo-updates and the provider context."
      >
        <View style={{ gap: 10 }}>
          <TelemetryRow label="status" value={status} />
          <TelemetryRow label="runtime version" value={runtimeVersion ?? 'N/A'} />
          <TelemetryRow label="channel" value={channel ?? 'N/A'} />
          <TelemetryRow label="embedded build" value={String(isEmbeddedUpdate)} />
          <TelemetryRow label="current update id" value={currentUpdateId ?? 'N/A'} />
        </View>
      </SectionCard>

      <SectionCard
        palette={palette}
        title="Event state flags"
        subtitle="Internal states used by banner and info screen event handling."
      >
        <View style={{ gap: 10 }}>
          <TelemetryRow label="update available" value={String(isUpdateAvailable)} />
          <TelemetryRow label="downloading" value={String(isDownloading)} />
          <TelemetryRow label="downloaded" value={String(isDownloaded)} />
          <TelemetryRow label="simulating" value={String(isSimulating)} />
        </View>
      </SectionCard>
    </ScreenView>
  );
}
