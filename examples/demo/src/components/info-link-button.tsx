import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { SFIcon } from '@/components/sf-icon';
import type { Palette } from '@/theme/palette';

type InfoLinkButtonProps = {
  palette: Palette;
};

export function InfoLinkButton({ palette }: InfoLinkButtonProps) {
  return (
    <Link href="/info" asChild>
      <Pressable
        accessibilityLabel="Open info tab"
        hitSlop={8}
        style={{
          marginRight: 14,
          width: 34,
          height: 34,
          borderRadius: 17,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.surface,
          borderWidth: 1,
          borderColor: palette.border,
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        {({ pressed }) => (
          <SFIcon
            sf="info.circle.fill"
            fallback="info-circle"
            size={18}
            color={pressed ? palette.textFaint : palette.accent}
          />
        )}
      </Pressable>
    </Link>
  );
}
