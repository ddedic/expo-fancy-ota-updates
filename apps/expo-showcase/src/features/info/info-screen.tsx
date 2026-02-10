import type { OTAInfoScreenProps } from '@ddedic/expo-fancy-ota-updates';
import { OTAInfoScreen } from '@ddedic/expo-fancy-ota-updates';
import { Text, View } from 'react-native';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';

type RenderInfoArgs = Parameters<NonNullable<OTAInfoScreenProps['renderInfo']>>[0];

type InfoScreenProps = {
  onBack?: () => void;
};

export function InfoScreen({ onBack }: InfoScreenProps) {
  const { palette, useCustomInfoRenderer, infoMode } = useShowcaseSettings();

  const renderInfo = useCustomInfoRenderer
    ? ({ status, otaVersion, otaBuildNumber, lastSkippedReason }: RenderInfoArgs) => (
        <View
          style={{
            borderWidth: 1,
            borderColor: palette.border,
            borderRadius: 14,
            borderCurve: 'continuous',
            padding: 12,
            backgroundColor: palette.surface,
            gap: 6,
          }}
        >
          <Text style={{ color: palette.text, fontWeight: '800', fontSize: 14 }} selectable>
            Custom Info Renderer
          </Text>
          <Text style={{ color: palette.textMuted, fontWeight: '600' }} selectable>
            status: {status}
          </Text>
          <Text style={{ color: palette.textMuted, fontWeight: '600' }} selectable>
            ota: {otaVersion} ({otaBuildNumber})
          </Text>
          <Text style={{ color: palette.textMuted, fontWeight: '600' }} selectable>
            lastSkippedReason: {lastSkippedReason || 'none'}
          </Text>
        </View>
      )
    : undefined;

  return (
    <OTAInfoScreen
      mode={infoMode}
      onBack={onBack}
      renderHeader={onBack ? undefined : () => null}
      renderInfo={renderInfo}
    />
  );
}
