
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { isSupabaseInitialized } from '../utils/supabase';

interface AppStatusCardProps {
  eventsCount: number;
  usersCount: number;
  isAdmin: boolean;
  onPress?: () => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
  connectionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  onlineText: {
    color: colors.success,
  },
  offlineText: {
    color: colors.warning,
  },
  adminBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default function AppStatusCard({ eventsCount, usersCount, isAdmin, onPress }: AppStatusCardProps) {
  const isOnline = isSupabaseInitialized();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Icon name="activity" size={24} color={colors.primary} />
        <Text style={styles.title}>System-Status</Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.statusItem}>
          <Text style={styles.statusNumber}>{eventsCount}</Text>
          <Text style={styles.statusLabel}>Veranstaltungen</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusNumber}>{usersCount}</Text>
          <Text style={styles.statusLabel}>Benutzer</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusNumber}>v1.0</Text>
          <Text style={styles.statusLabel}>Version</Text>
        </View>
      </View>

      <View style={styles.connectionStatus}>
        <Icon 
          name={isOnline ? "wifi" : "wifi-off"} 
          size={16} 
          color={isOnline ? colors.success : colors.warning} 
        />
        <Text style={[styles.connectionText, isOnline ? styles.onlineText : styles.offlineText]}>
          {isOnline ? 'Online & Einsatzbereit' : 'Offline-Modus'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
