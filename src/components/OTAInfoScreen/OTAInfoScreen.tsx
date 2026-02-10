import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOTAUpdates } from '../../context/OTAUpdatesProvider';
import { BackIcon } from '../Icons';

import type { 
  OTAInfoScreenProps, 
  RenderInfoProps, 
  RenderActionsProps, 
  RenderChangelogProps 
} from '../../types';

import { styles } from './styles';
import { getVisibility } from './utils';
import { OTAUpdateInfo } from './OTAUpdateInfo';
import { OTAUpdateActions } from './OTAUpdateActions';
import { OTAUpdateChangelog } from './OTAUpdateChangelog';

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
    status,
    lastSkippedReason,
    isEmbeddedUpdate,
    runtimeVersion,
    otaVersion,
    otaBuildNumber,
    otaReleaseDate,
    currentUpdateId,
    isUpdateAvailable,
    isDownloading,
    isDownloaded,
    isSimulating,
    checkForUpdate,
    downloadUpdate,
    reloadApp,
    simulateUpdate,
    resetSimulation,
    otaChangelog,
  } = useOTAUpdates();

  const { colors } = theme;
  const { infoScreen: t } = translations;
  
  const visibilityConfig = {
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
    ...props,
  };
  
  const visibility = getVisibility(visibilityConfig);

  // Prepare props objects for render functions
  const infoProps: RenderInfoProps = {
    theme,
    translations,
    status,
    lastSkippedReason,
    isEmbeddedUpdate,
    runtimeVersion,
    otaVersion,
    otaBuildNumber,
    otaReleaseDate,
    currentUpdateId,
    channel,
    isUpdateAvailable,
  };

  const actionsProps: RenderActionsProps = {
    theme,
    translations,
    status,
    isDownloading,
    isUpdateAvailable,
    isDownloaded,
    isSimulating,
    checkForUpdate,
    downloadUpdate,
    reloadApp,
    simulateUpdate,
    resetSimulation,
  };

  const changelogProps: RenderChangelogProps = {
    theme,
    translations,
    otaChangelog,
  };

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
        {renderInfo 
          ? renderInfo(infoProps) 
          : <OTAUpdateInfo {...visibilityConfig} {...infoProps} />
        }
        
        {renderActions 
          ? renderActions(actionsProps) 
          : <OTAUpdateActions {...visibilityConfig} {...actionsProps} />
        }
        
        {renderChangelog 
          ? renderChangelog(changelogProps) 
          : <OTAUpdateChangelog {...visibilityConfig} {...changelogProps} style={{ marginTop: 24 }} />
        }
      </ScrollView>
    </View>
  );
}
