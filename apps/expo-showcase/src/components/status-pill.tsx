import { Text, View } from 'react-native';

import type { UpdateStatus } from '@ddedic/expo-fancy-ota-updates';
import type { Palette } from '@/theme/palette';

const statusTone: Record<UpdateStatus, { background: string; text: string }> = {
  idle: { background: '#E5E1DA', text: '#5C5244' },
  checking: { background: '#FFF3D6', text: '#9B6A00' },
  available: { background: '#D6E0FF', text: '#1F3FAA' },
  downloading: { background: '#D6F3FF', text: '#0D5E88' },
  downloaded: { background: '#D8F6E7', text: '#1E7A4B' },
  error: { background: '#FFE0DE', text: '#B53A2A' },
};

type StatusPillProps = {
  palette: Palette;
  status: UpdateStatus;
};

export function StatusPill({ palette, status }: StatusPillProps) {
  const tone = statusTone[status];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: tone.background,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text style={{ color: tone.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }} selectable>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}
