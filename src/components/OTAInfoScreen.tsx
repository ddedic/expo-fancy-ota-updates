/**
 * @technabit/expo-fancy-ota-updates
 * OTA Info/Debug Screen Component
 */

import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOTAUpdates } from '../context/OTAUpdatesProvider';
import { DownloadIcon, RefreshIcon, BackIcon } from './Icons';
import type { OTAInfoScreenProps } from '../types';

// ============================================================================
// OTAInfoScreen Component
// ============================================================================

export function OTAInfoScreen({ 
  renderHeader,
  onBack,
  style,
  // Mode configuration
  mode = 'developer',
  // Visibility configuration - use explicit values or compute from mode
  showRuntimeVersion,
  showOtaVersion,
  showReleaseDate,
  showUpdateId,
  showChannel,
  showChangelog,
  showCheckButton,
  showDownloadButton,
  showReloadButton,
  showDebugSection,
  // Deprecated prop
  hideDebug,
}: OTAInfoScreenProps = {}) {
  const insets = useSafeAreaInsets();
  
  const { 
    isUpdateAvailable, 
    isDownloading, 
    isDownloaded, 
    status,
    checkForUpdate, 
    downloadUpdate, 
    reloadApp,
    channel,
    runtimeVersion,
    currentUpdateId,
    isEmbeddedUpdate,
    simulateUpdate,
    isSimulating,
    resetSimulation,
    otaVersion,
    otaBuildNumber,
    otaReleaseDate,
    otaChangelog,
    theme,
    translations,
  } = useOTAUpdates();

  const { colors, borderRadius } = theme;
  const { infoScreen: t } = translations;

  // Compute visibility based on mode and explicit props
  // Developer mode: show everything by default
  // User mode: hide debug section and update ID by default
  const isUserMode = mode === 'user';
  
  const visibility = {
    runtimeVersion: showRuntimeVersion ?? true,
    otaVersion: showOtaVersion ?? true,
    releaseDate: showReleaseDate ?? true,
    updateId: showUpdateId ?? !isUserMode, // Hidden in user mode by default
    channel: showChannel ?? true,
    changelog: showChangelog ?? true,
    checkButton: showCheckButton ?? true,
    downloadButton: showDownloadButton ?? true,
    reloadButton: showReloadButton ?? true,
    // Debug section: respect deprecated hideDebug or new showDebugSection, default hidden in user mode
    debugSection: showDebugSection ?? (hideDebug !== undefined ? !hideDebug : !isUserMode),
  };

  // Format date
  const formattedDate = otaReleaseDate 
    ? new Date(otaReleaseDate).toLocaleDateString() 
    : t.notAvailable;

  // Truncate update ID
  const truncatedUpdateId = currentUpdateId 
    ? `${currentUpdateId.slice(0, 12)}...` 
    : t.none;

  // Status badge color
  const getStatusColor = () => {
    if (__DEV__) return colors.warning;
    if (isUpdateAvailable) return colors.primary;
    return colors.textSecondary;
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {/* Header */}
      {renderHeader ? (
        renderHeader({ theme, onBack })
      ) : (
        <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <BackIcon size={28} color={colors.text} />
            </TouchableOpacity>
          )}
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t.title}</Text>
            {visibility.channel && (
              <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                {channel ? `${t.channel}: ${channel}` : `${t.channel}: default`}
              </Text>
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderRadius }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.icon, { backgroundColor: colors.primary + '20' }]}>
                <DownloadIcon size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{t.statusTitle}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  {isEmbeddedUpdate ? t.embeddedBuild : t.otaUpdate}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {__DEV__ ? t.devMode : status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Version Info */}
          <View style={styles.infoSection}>
            {visibility.runtimeVersion && (
              <InfoRow 
                label={t.runtimeVersion} 
                value={runtimeVersion ?? t.notAvailable} 
                colors={colors} 
              />
            )}
            {visibility.otaVersion && (
              <InfoRow 
                label={t.otaVersion} 
                value={`${otaVersion} (${otaBuildNumber})`} 
                colors={colors} 
              />
            )}
            {visibility.releaseDate && (
              <InfoRow 
                label={t.releaseDate} 
                value={formattedDate} 
                colors={colors} 
              />
            )}
            {visibility.updateId && (
              <InfoRow 
                label={t.updateId} 
                value={truncatedUpdateId} 
                colors={colors}
                isMonospace
              />
            )}
          </View>

          {/* Changelog */}
          {visibility.changelog && otaChangelog.length > 0 && (
            <View style={[styles.changelogContainer, { backgroundColor: colors.backgroundTertiary, borderRadius: (borderRadius ?? 16) - 4 }]}>
              <Text style={[styles.changelogTitle, { color: colors.text }]}>{t.whatsNew}</Text>
              <View style={styles.changelogList}>
                {otaChangelog.map((log: string, index: number) => (
                  <View key={index} style={styles.changelogRow}>
                    <View style={[styles.changelogBullet, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.changelogItemText, { color: colors.textSecondary }]}>
                      {log}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '50%' }]} />
              </View>
              <View style={styles.progressRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  Downloading update...
                </Text>
              </View>
            </View>
          )}

          {/* Actions */}
          {visibility.checkButton && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.backgroundTertiary, borderRadius: borderRadius ?? 12 }]}
                onPress={() => checkForUpdate()}
                disabled={isDownloading}
                activeOpacity={0.7}
              >
                <RefreshIcon size={16} color={colors.text} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  {t.checkForUpdates}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {visibility.downloadButton && isUpdateAvailable && !isDownloaded && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary + '20', borderRadius: borderRadius ?? 12 }]}
                onPress={() => downloadUpdate()}
                disabled={isDownloading}
                activeOpacity={0.7}
              >
                <DownloadIcon size={16} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  {t.downloadUpdate}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {visibility.reloadButton && isDownloaded && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success + '20', borderRadius: borderRadius ?? 12 }]}
                onPress={() => reloadApp()}
                activeOpacity={0.7}
              >
                <RefreshIcon size={16} color={colors.success} />
                <Text style={[styles.actionButtonText, { color: colors.success }]}>
                  {t.reloadApp}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Debug Actions */}
          {visibility.debugSection && (
            <View style={[styles.debugSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.debugTitle, { color: colors.textSecondary }]}>{t.debugTitle}</Text>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.backgroundTertiary, borderRadius: borderRadius ?? 12 }]}
                onPress={() => isSimulating ? resetSimulation() : simulateUpdate()}
                activeOpacity={0.7}
              >
                <DownloadIcon size={16} color={colors.text} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  {isSimulating ? t.hideSimulation : t.simulateUpdate}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

interface InfoRowProps {
  label: string;
  value: string;
  colors: { text: string; textSecondary: string };
  isMonospace?: boolean;
}

function InfoRow({ label, value, colors, isMonospace }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[
        styles.infoValue, 
        { color: colors.text },
        isMonospace && { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) }
      ]}>
        {value}
      </Text>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  headerSubtitle: { fontSize: 12 },
  content: { padding: 20 },
  
  card: {
    padding: 20,
    gap: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 13 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  
  infoSection: { gap: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  
  changelogContainer: {
    padding: 16,
    gap: 8,
  },
  changelogTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  changelogList: {
    gap: 8,
  },
  changelogRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  changelogBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  changelogItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  changelogItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  progressContainer: { gap: 8 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
  },
  
  actionRow: { gap: 8 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  actionButtonText: { fontSize: 15, fontWeight: '600' },
  
  debugSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
