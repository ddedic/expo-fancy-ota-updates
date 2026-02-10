import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { OTATheme, UpdateBannerProps } from '@ddedic/expo-fancy-ota-updates';
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';

import { useShowcaseSettings } from '@/ota/showcase-settings-context';
import { versionData } from '@/ota/version-data';

function useShowcaseTheme(): OTATheme {
  const { palette } = useShowcaseSettings();

  return useMemo(
    () => ({
      colors: {
        primary: palette.accent,
        primaryLight: palette.accentSoft,
        background: palette.background,
        backgroundSecondary: palette.surface,
        backgroundTertiary: palette.surfaceMuted,
        text: palette.text,
        textSecondary: palette.textMuted,
        textTertiary: palette.textFaint,
        border: palette.border,
        error: palette.error,
        success: palette.success,
        warning: palette.warning,
      },
      bannerGradient: [palette.accent, palette.accentSoft],
      borderRadius: 18,
      buttonBorderRadius: 16,
      animation: {
        duration: 260,
        pulseDuration: 760,
      },
    }),
    [palette]
  );
}

function CustomBanner({
  isUpdateAvailable,
  isDownloaded,
  isDownloading,
  otaVersion,
  onUpdate,
  onRestart,
  onDismiss,
  theme,
}: Parameters<NonNullable<UpdateBannerProps['renderBanner']>>[0]) {
  const router = useRouter();

  const callToAction = isDownloaded ? 'Restart now' : 'Download update';
  const subtitle = isDownloaded
    ? 'Restart to apply the update.'
    : isDownloading
      ? 'Downloading update...'
      : `New OTA payload ready (${otaVersion}).`;

  return (
    <View
      style={{
        padding: 14,
        borderRadius: 18,
        gap: 10,
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: '700' }} selectable>
            {isUpdateAvailable ? 'Update available' : 'Update ready'}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }} selectable>
            {subtitle}
          </Text>
        </View>
        <Pressable
          onPress={onDismiss}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.backgroundTertiary,
          }}
        >
          <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }} selectable>
            X
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={isDownloaded ? onRestart : onUpdate}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }} selectable>
            {callToAction}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/info')}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: 12 }} selectable>
            Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function OTAProviderShell({ children }: PropsWithChildren) {
  const { useCustomBanner } = useShowcaseSettings();
  const theme = useShowcaseTheme();

  return (
    <OTAUpdatesProvider
      theme={theme}
      config={{
        checkOnMount: true,
        checkOnForeground: true,
        autoDownload: false,
        autoReload: false,
        versionData,
        debug: true,
      }}
    >
      <UpdateBanner
        renderBanner={useCustomBanner ? (props) => <CustomBanner {...props} /> : undefined}
      />
      {children}
    </OTAUpdatesProvider>
  );
}
