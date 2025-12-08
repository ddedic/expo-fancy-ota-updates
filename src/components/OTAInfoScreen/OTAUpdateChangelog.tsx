import React from 'react';
import { View, Text } from 'react-native';
import { useOTAUpdates } from '../../context/OTAUpdatesProvider';
import type { OTAInfoScreenProps, RenderChangelogProps } from '../../types';
import { styles } from './styles';
import { getVisibility, parseCommitMessage, getCommitBadge } from './utils';

export function OTAUpdateChangelog(props: OTAInfoScreenProps & Partial<RenderChangelogProps>) {
  const context = useOTAUpdates();
  
  const theme = props.theme || context.theme;
  const translations = props.translations || context.translations;
  const otaChangelog = props.otaChangelog || context.otaChangelog;
  
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
