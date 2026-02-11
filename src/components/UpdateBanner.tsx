/**
 * @ddedic/expo-fancy-ota-updates
 * Animated Update Banner Component
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

import { useOTAUpdates } from '../context/OTAUpdatesProvider';
import { DownloadIcon, CloseIcon } from './Icons';
import type { UpdateBannerProps } from '../types';

interface GradientWrapperProps {
  colors: readonly string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
  children?: React.ReactNode;
}

const SolidGradientFallback: React.FC<GradientWrapperProps> = ({ colors, style, children }) => {
  const fallbackColor = colors[0] || '#000000';
  return <View style={[style, { backgroundColor: fallbackColor }]}>{children}</View>;
};

let CachedGradientComponent: React.ComponentType<GradientWrapperProps> | null | undefined;

function getGradientComponent(): React.ComponentType<GradientWrapperProps> {
  if (CachedGradientComponent !== undefined) {
    return CachedGradientComponent || SolidGradientFallback;
  }

  try {
    // Avoid static module resolution so expo-linear-gradient stays truly optional.
    const dynamicRequire = Function('name', 'return require(name);') as (name: string) => any;
    const mod = dynamicRequire('expo-linear-gradient');
    if (mod?.LinearGradient) {
      CachedGradientComponent = mod.LinearGradient as React.ComponentType<GradientWrapperProps>;
      return CachedGradientComponent;
    }
  } catch {
    // Fallback to a solid background when optional dependency is not installed.
  }

  CachedGradientComponent = null;
  return SolidGradientFallback;
}

// ============================================================================
// UpdateBanner Component
// ============================================================================

export function UpdateBanner({ 
  renderBanner,
  style,
  visible: controlledVisible,
  onDismiss,
}: UpdateBannerProps = {}) {
  const insets = useSafeAreaInsets();
  const [isDismissed, setIsDismissed] = useState(false);
  
  const { 
    isUpdateAvailable, 
    isDownloading, 
    isDownloaded, 
    isSimulating,
    downloadUpdate, 
    reloadApp,
    resetSimulation,
    otaVersion,
    theme,
    translations,
  } = useOTAUpdates();

  const { colors, bannerGradient, buttonBorderRadius, animation } = theme;
  const { banner: t } = translations;

  // Pulse animation for the action button
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: animation?.pulseDuration ?? 800 }),
        withTiming(1, { duration: animation?.pulseDuration ?? 800 })
      ),
      -1,
      false
    );
  }, [animation?.pulseDuration]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Reset dismissed state when a new update becomes available
  useEffect(() => {
    if (isUpdateAvailable) {
      setIsDismissed(false);
    }
  }, [isUpdateAvailable]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // If we're simulating, reset the simulation state so isUpdateAvailable goes back to false
    if (isSimulating) {
      resetSimulation();
    }
    onDismiss?.();
  };

  const handleAction = () => {
    if (isDownloaded) {
      reloadApp();
    } else {
      downloadUpdate();
    }
  };

  // Determine visibility
  const isControlled = controlledVisible !== undefined;
  const shouldShow = isControlled 
    ? controlledVisible 
    : (!isDismissed && (isUpdateAvailable || isDownloaded));

  if (!shouldShow) {
    return null;
  }

  // If custom render function provided, use it
  if (renderBanner) {
    return (
      <Animated.View 
        entering={FadeInDown.duration(animation?.duration ?? 300)} 
        exiting={FadeOutUp.duration((animation?.duration ?? 300) * 0.66)}
        style={[styles.container, { paddingTop: insets.top }, style]}
      >
        {renderBanner({
          isUpdateAvailable,
          isDownloading,
          isDownloaded,
          otaVersion,
          onUpdate: downloadUpdate,
          onRestart: reloadApp,
          onDismiss: handleDismiss,
          theme,
          translations: t,
        })}
      </Animated.View>
    );
  }

  // Default banner UI
  const gradientColors = bannerGradient ?? [colors.primary, colors.primaryLight];
  const GradientComponent = getGradientComponent();

  return (
    <Animated.View 
      entering={FadeInDown.duration(animation?.duration ?? 300)} 
      exiting={FadeOutUp.duration((animation?.duration ?? 300) * 0.66)}
      style={[styles.container, { paddingTop: insets.top }, style]}
    >
      <GradientComponent
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.content, { borderBottomColor: gradientColors[1] }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <DownloadIcon size={18} color={colors.primary} />
            )}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: '#FFFFFF' }]}>
              {isDownloaded ? t.updateReady : t.updateAvailable}
            </Text>
            <Text style={[styles.subtitle, { color: '#FFFFFF', opacity: 0.9 }]}>
              {isDownloaded 
                ? t.restartToApply 
                : isDownloading 
                  ? t.downloading 
                  : `${t.versionAvailable} (${otaVersion})`}
            </Text>
          </View>

          <View style={styles.actions}>
            {!isDownloading && (
              <Animated.View style={pulseStyle}>
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    { 
                      backgroundColor: '#FFFFFF',
                      borderRadius: buttonBorderRadius ?? 20,
                    }
                  ]} 
                  onPress={handleAction}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    {isDownloaded ? t.restartButton : t.updateButton}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleDismiss}
              activeOpacity={0.7}
            >
              <CloseIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </GradientComponent>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  gradient: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
});
