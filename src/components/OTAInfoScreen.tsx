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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOTAUpdates } from '../context/OTAUpdatesProvider';
import { DownloadIcon, RefreshIcon, BackIcon } from './Icons';
import type { OTAInfoScreenProps } from '../types';

// ============================================================================
// Changelog Helpers
// ============================================================================

interface CommitInfo {
  type: string;
  scope?: string;
  message: string;
  original: string;
}

function parseCommitMessage(log: string): CommitInfo {
  // Regex for conventional commits: type(scope)!: message
  const match = log.match(/^([a-z]+)(?:\(([^)]+)\))?(!)?: (.+)$/);
  
  if (!match) {
    return { type: 'update', message: log, original: log };
  }
  
  return {
    type: match[1].toLowerCase(),
    scope: match[2],
    message: match[4], // skip bang match[3]
    original: log,
  };
}

function getCommitBadge(type: string, colors: any) {
  switch (type) {
    case 'feat':
    case 'feature':
      return { bg: colors.primary + '20', text: colors.primary, label: 'FEAT' };
    case 'fix':
    case 'bug':
      return { bg: colors.error + '20', text: colors.error, label: 'FIX' };
    case 'perf':
      return { bg: colors.success + '20', text: colors.success, label: 'PERF' };
    case 'refactor':
      return { bg: colors.warning + '20', text: colors.warning, label: 'REFACTOR' };
    case 'chore':
      return { bg: colors.textSecondary + '20', text: colors.textSecondary, label: 'CHORE' };
    case 'docs':
      return { bg: colors.textSecondary + '20', text: colors.textSecondary, label: 'DOCS' };
    default:
      return { bg: colors.textSecondary + '15', text: colors.textSecondary, label: 'UPDATE' };
  }
}

// ============================================================================
// OTAInfoScreen Component
// ============================================================================

// ============================================================================
// Visibility Helper
// ============================================================================

function getVisibility(props: OTAInfoScreenProps) {
  const { 
    mode = 'developer',
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
    hideDebug,
  } = props;

  const isUserMode = mode === 'user';
  
  return {
    runtimeVersion: showRuntimeVersion ?? true,
    otaVersion: showOtaVersion ?? true,
    releaseDate: showReleaseDate ?? true,
    updateId: showUpdateId ?? !isUserMode,
    channel: showChannel ?? true,
    changelog: showChangelog ?? true,
    checkButton: showCheckButton ?? true,
    downloadButton: showDownloadButton ?? true,
    reloadButton: showReloadButton ?? true,
    debugSection: showDebugSection ?? (hideDebug !== undefined ? !hideDebug : !isUserMode),
  };
}

// ============================================================================
// Sub-Components
// ============================================================================

export function OTAUpdateInfo(props: OTAInfoScreenProps) {
  const { 
    isEmbeddedUpdate, 
    status, 
    channel, 
    runtimeVersion, 
    otaVersion, 
    otaBuildNumber, 
    otaReleaseDate, 
    currentUpdateId,
    isUpdateAvailable,
    theme, 
    translations 
  } = useOTAUpdates();
  
  const { colors, borderRadius } = theme;
  const { infoScreen: t } = translations;
  
  const visibility = getVisibility(props);
  
  // Format date
  const formattedDate = otaReleaseDate 
    ? new Date(otaReleaseDate).toLocaleDateString() 
    : t.notAvailable;

  // Truncate update ID
  const truncatedUpdateId = currentUpdateId 
    ? `${currentUpdateId.slice(0, 12)}...` 
    : t.none;

  // Status badge logic
  const isUserMode = props.mode === 'user';
  const showDevIndicator = __DEV__ && !isUserMode;
  const getStatusColor = () => {
    if (showDevIndicator) return colors.warning;
    if (isUpdateAvailable) return colors.primary;
    return colors.textSecondary;
  };
  const statusColor = getStatusColor();

  return (
    <>
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
              {showDevIndicator ? t.devMode : status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Version Info Group */}
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
      </View>
    </>
  );
}

export function OTAUpdateActions(props: OTAInfoScreenProps) {
  const { 
    isDownloading, 
    isUpdateAvailable, 
    isDownloaded, 
    checkForUpdate, 
    downloadUpdate, 
    reloadApp, 
    simulateUpdate, 
    isSimulating, 
    resetSimulation, 
    theme, 
    translations 
  } = useOTAUpdates();
  
  const { colors, borderRadius } = theme;
  const { infoScreen: t } = translations;
  const visibility = getVisibility(props);

  const handleCheckForUpdate = async () => {
    try {
      const result = await checkForUpdate();
      if (result.isSkipped) {
        Alert.alert(t.devMode, `Check skipped: ${result.reason}`);
      } else if (result.isAvailable) {
        Alert.alert(translations.banner.updateAvailable, translations.banner.updateReady);
      } else if (result.error) {
        console.error(result.error);
        Alert.alert("Error check failed", result.error.message || "Failed to check for updates");
      } else {
        Alert.alert("Up to Date", "You are on the latest version.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Download Progress */}
      {isDownloading && (
        <View style={[styles.progressContainer, { backgroundColor: colors.backgroundSecondary }]}>
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
            onPress={handleCheckForUpdate}
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
    </>
  );
}

export function OTAUpdateChangelog(props: OTAInfoScreenProps) {
  const { otaChangelog, theme, translations } = useOTAUpdates();
  const { colors, borderRadius } = theme;
  const { infoScreen: t } = translations;
  const visibility = getVisibility(props);

  if (!visibility.changelog || otaChangelog.length === 0) return null;

  return (
    <View style={[styles.changelogList, props.style]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.whatsNew}</Text>
      {otaChangelog.map((log: string, index: number) => {
        const info = parseCommitMessage(log);
        const badge = getCommitBadge(info.type, colors);
        
        return (
          <View key={index} style={[styles.changelogCard, { backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius ?? 12 }]}>
            <View style={[styles.changelogDot, { backgroundColor: badge.text }]} />
            <View style={styles.changelogContent}>
              {info.scope && (
                <Text style={[styles.changelogScope, { color: colors.textTertiary }]}>
                  {info.scope}
                </Text>
              )}
              <Text style={[styles.changelogItemText, { color: colors.textSecondary }]}>
                {info.message}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ============================================================================
// OTAInfoScreen Component
// ============================================================================

export function OTAInfoScreen({ 
  renderHeader,
  renderInfo,
  renderActions,
  renderChangelog,
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
  ...props // Catch all other props to pass to sub-components
}: OTAInfoScreenProps = {}) {
  const insets = useSafeAreaInsets();
  
  const { 
    channel,
    theme,
    translations,
  } = useOTAUpdates();

  const { colors } = theme;
  const { infoScreen: t } = translations;
  
  const visibility = getVisibility({
    mode,
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
    hideDebug,
    ...props, // Ensure any other props that might influence visibility are passed
  });

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
        {renderInfo ? renderInfo({ theme }) : <OTAUpdateInfo {...{ mode, showRuntimeVersion, showOtaVersion, showReleaseDate, showUpdateId, showChannel, showChangelog, showCheckButton, showDownloadButton, showReloadButton, showDebugSection, hideDebug, ...props }} />}
        
        {renderActions ? renderActions({ theme }) : <OTAUpdateActions {...{ mode, showRuntimeVersion, showOtaVersion, showReleaseDate, showUpdateId, showChannel, showChangelog, showCheckButton, showDownloadButton, showReloadButton, showDebugSection, hideDebug, ...props }} />}
        
        {renderChangelog ? renderChangelog({ theme }) : <OTAUpdateChangelog {...{ mode, showRuntimeVersion, showOtaVersion, showReleaseDate, showUpdateId, showChannel, showChangelog, showCheckButton, showDownloadButton, showReloadButton, showDebugSection, hideDebug, ...props }} style={{ marginTop: 24 }} />}
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
  content: { padding: 20, gap: 20 },
  
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
  
  infoSection: { gap: 16 }, // Container gap
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical potentially handled by container gap or explicit
  },
  infoLabel: { fontSize: 14, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600' },
  
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },

  changelogList: {
    gap: 12,
  },
  changelogCard: {
    padding: 16,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  changelogDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  changelogContent: {
    flex: 1,
    gap: 4,
  },
  changelogScope: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  changelogItemText: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  progressContainer: { 
    gap: 8,
    padding: 20,
  },
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
