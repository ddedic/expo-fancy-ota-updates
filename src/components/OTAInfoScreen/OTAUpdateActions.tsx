import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useOTAUpdates } from '../../context/OTAUpdatesProvider';
import { DownloadIcon, RefreshIcon } from '../Icons';
import type { OTAInfoScreenProps, RenderActionsProps } from '../../types';
import { styles } from './styles';
import { getVisibility } from './utils';

export function OTAUpdateActions(props: OTAInfoScreenProps & Partial<RenderActionsProps>) {
  const context = useOTAUpdates();
  
  // Prioritize passed props, fallback to context
  const theme = props.theme || context.theme;
  const translations = props.translations || context.translations;
  const isDownloading = props.isDownloading ?? context.isDownloading;
  const isUpdateAvailable = props.isUpdateAvailable ?? context.isUpdateAvailable;
  const isDownloaded = props.isDownloaded ?? context.isDownloaded;
  const isSimulating = props.isSimulating ?? context.isSimulating;
  
  const checkForUpdate = props.checkForUpdate || context.checkForUpdate;
  const downloadUpdate = props.downloadUpdate || context.downloadUpdate;
  const reloadApp = props.reloadApp || context.reloadApp;
  const simulateUpdate = props.simulateUpdate || context.simulateUpdate;
  const resetSimulation = props.resetSimulation || context.resetSimulation;

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
