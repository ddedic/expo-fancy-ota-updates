import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';

import type { Palette } from '@/theme/palette';

type ScreenViewProps = PropsWithChildren<{
  palette: Palette;
  header?: React.ReactNode;
}>;

export function ScreenView({ palette, header, children }: ScreenViewProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
    >
      {header}
      {children}
    </ScrollView>
  );
}
