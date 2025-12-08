import React from 'react';
import { View, Text } from 'react-native';
import { useOTAUpdates } from '../../context/OTAUpdatesProvider';
import { DownloadIcon } from '../Icons';
import type { OTAInfoScreenProps, RenderInfoProps } from '../../types';
import { styles } from './styles';
import { getVisibility } from './utils';
import { InfoRow } from './InfoRow';

export function OTAUpdateInfo(props: OTAInfoScreenProps & Partial<RenderInfoProps>) {
  const context = useOTAUpdates();
  
  // Prioritize passed props, fallback to context
  const theme = props.theme || context.theme;
  const translations = props.translations || context.translations;
  const isEmbeddedUpdate = props.isEmbeddedUpdate ?? context.isEmbeddedUpdate;
  const status = props.status || context.status;
  const runtimeVersion = props.runtimeVersion ?? context.runtimeVersion;
  const otaVersion = props.otaVersion || context.otaVersion;
  const otaBuildNumber = props.otaBuildNumber ?? context.otaBuildNumber;
  const otaReleaseDate = props.otaReleaseDate || context.otaReleaseDate;
  const currentUpdateId = props.currentUpdateId ?? context.currentUpdateId;
  const isUpdateAvailable = props.isUpdateAvailable ?? context.isUpdateAvailable;
  
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
  );
}
