import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styles } from './styles';

interface InfoRowProps {
  label: string;
  value: string;
  colors: { text: string; textSecondary: string };
  isMonospace?: boolean;
}

export function InfoRow({ label, value, colors, isMonospace }: InfoRowProps) {
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
