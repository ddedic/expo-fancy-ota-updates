/**
 * @technabit/expo-fancy-ota-updates
 * Icon Components with Lucide fallback
 */

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

// Try to import lucide icons, fallback to text if not available
let LucideCloudDownload: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;
let LucideRefreshCw: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;
let LucideX: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;
let LucideChevronLeft: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;
let LucideCheck: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;
let LucideAlertCircle: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> | null = null;

try {
  const lucide = require('lucide-react-native');
  LucideCloudDownload = lucide.CloudDownload;
  LucideRefreshCw = lucide.RefreshCw;
  LucideX = lucide.X;
  LucideChevronLeft = lucide.ChevronLeft;
  LucideCheck = lucide.Check;
  LucideAlertCircle = lucide.AlertCircle;
} catch {
  // lucide-react-native not installed, will use fallbacks
}

// ============================================================================
// Icon Props
// ============================================================================

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// ============================================================================
// Icon Components with Fallbacks
// ============================================================================

export function DownloadIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideCloudDownload) {
    return <LucideCloudDownload size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size * 0.8, color }]}>↓</Text>
    </View>
  );
}

export function RefreshIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideRefreshCw) {
    return <LucideRefreshCw size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size * 0.8, color }]}>↻</Text>
    </View>
  );
}

export function CloseIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideX) {
    return <LucideX size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size * 0.8, color }]}>✕</Text>
    </View>
  );
}

export function BackIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideChevronLeft) {
    return <LucideChevronLeft size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size, color }]}>‹</Text>
    </View>
  );
}

export function CheckIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideCheck) {
    return <LucideCheck size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size * 0.8, color }]}>✓</Text>
    </View>
  );
}

export function AlertIcon({ size = 24, color = '#000' }: IconProps) {
  if (LucideAlertCircle) {
    return <LucideAlertCircle size={size} color={color} strokeWidth={2} />;
  }
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackIcon, { fontSize: size * 0.8, color }]}>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    fontWeight: 'bold',
  },
});
