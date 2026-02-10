import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

import type { Palette } from '@/theme/palette';

type SectionCardProps = PropsWithChildren<{
  palette: Palette;
  title: string;
  subtitle?: string;
}>;

export function SectionCard({ palette, title, subtitle, children }: SectionCardProps) {
  return (
    <View
      style={{
        backgroundColor: palette.surface,
        borderRadius: 20,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: palette.border,
        padding: 16,
        gap: 10,
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ color: palette.text, fontSize: 16, fontWeight: '700' }} selectable>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '600' }} selectable>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
