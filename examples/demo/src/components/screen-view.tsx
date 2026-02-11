import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Palette } from '@/theme/palette';

type ScreenViewProps = PropsWithChildren<{
  palette: Palette;
  header?: React.ReactNode;
}>;

export function ScreenView({ palette, header, children }: ScreenViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 112, gap: 16 }}
    >
      {header}
      {children}
    </ScrollView>
  );
}
