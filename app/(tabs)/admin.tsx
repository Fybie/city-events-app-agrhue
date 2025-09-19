
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EventCard from '../../components/EventCard';
import SupabaseConnectionSheet from '../../components/SupabaseConnectionSheet';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { adminUser } from '../../data/mockData';
import { Platform } from 'react-native';
import { isSupabaseInitialized } from '../../utils/supabase';

const AdminScreen = () => {
  const { events, deleteEvent, likeEvent, reportEvent, isFavorite, toggleFavorite } = useEvents();
  const { checkAuthStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'reports' | 'settings'>('events');
  const [isSupabaseSheetVisible, setIsSupabaseSheetVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Berechne den unteren Abstand für die Tab-Bar
  const tabBarHeight = Platform.OS === 'ios' ? 50 + Math.max(insets.bottom - 10, 0) : 60;

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Event löschen',
      'Sind Sie sicher, dass Sie dieses Event als Admin löschen möchten?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            console.log('Admin deleting event:', eventId);
            deleteEvent(eventId);
          }
        }
      ]
    );
  };

  const handleBanUser = (userId: string, userName: string) => {
    Alert.alert(
      'Benutzer sperren',
      `Möchten Sie den Benutzer "${userName}" sperren?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Sperren', 
          style: 'destructive',
          onPress: () => {
            console.log('Admin banning user:', userId, userName);
            Alert.alert('Erfolg', `Benutzer "${userName}" wurde gesperrt.`);
          }
        }
      ]
    );
  };

  const handleSupabaseConnected = () => {
    console.log('Supabase verbunden, prüfe Auth-Status');
    checkAuthStatus();
  };

  const renderEventsTab = () => (
    <ScrollView
      style={styles.content}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {events.map((event) => (
        <View key={event.id} style={styles.eventContainer}>
          <EventCard
            event={event}
            onPress={() => console.log('Admin viewing event:', event.id)}
            onLike={() => likeEvent(event.id)}
            onFavorite={() => toggleFavorite(event)}
            isFavorite={isFavorite(event.id)}
            showActions={true}
            onReport={() => reportEvent(event.id)}
            onDelete={() => handleDeleteEvent(event.id)}
          />
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => handleBanUser(event.authorId, event.author)}
            >
              <Icon name="person-remove" size={16} color={colors.error} />
              <Text style={styles.adminButtonText}>Benutzer sperren</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminButton, styles.deleteButton]}
              onPress={() => handleDeleteEvent(event.id)}
            >
              <Icon name="trash" size={16} color={colors.error} />
              <Text style={styles.adminButtonText}>Event löschen</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {events.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="calendar-outline" size={64} color={colors.grey} />
          <Text style={styles.emptyStateTitle}>Keine Events</Text>
          <Text style={styles.emptyStateText}>
            Es wurden noch keine Events erstellt.
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderReportsTab = () => {
    const reportedEvents = events.filter(e => e.reported);
    
    return (
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {reportedEvents.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <EventCard
              event={event}
              onPress={() => console.log('Admin viewing reported event:', event.id)}
              onLike={() => likeEvent(event.id)}
              onFavorite={() => toggleFavorite(event)}
              isFavorite={isFavorite(event.id)}
              showActions={true}
              onReport={() => reportEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
            />
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => handleBanUser(event.authorId, event.author)}
              >
                <Icon name="person-remove" size={16} color={colors.error} />
                <Text style={styles.adminButtonText}>Benutzer sperren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminButton, styles.deleteButton]}
                onPress={() => handleDeleteEvent(event.id)}
              >
                <Icon name="trash" size={16} color={colors.error} />
                <Text style={styles.adminButtonText}>Event löschen</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {reportedEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="flag-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>Keine Meldungen</Text>
            <Text style={styles.emptyStateText}>
              Es liegen keine gemeldeten Events vor.
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderSettingsTab = () => (
    <ScrollView
      style={styles.content}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Datenbankverbindung</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingsCardHeader}>
            <Icon 
              name={isSupabaseInitialized() ? "cloud-done" : "cloud-offline"} 
              size={24} 
              color={isSupabaseInitialized() ? colors.success : colors.grey} 
            />
            <View style={styles.settingsCardText}>
              <Text style={styles.settingsCardTitle}>Supabase</Text>
              <Text style={styles.settingsCardSubtitle}>
                {isSupabaseInitialized() 
                  ? 'Verbunden - Authentifizierung und Datenspeicherung aktiv'
                  : 'Nicht verbunden - Nur lokale Mock-Daten verfügbar'
                }
              </Text>
            </View>
          </View>
          
          {!isSupabaseInitialized() && (
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => setIsSupabaseSheetVisible(true)}
            >
              <Icon name="link" size={16} color="white" />
              <Text style={styles.connectButtonText}>Jetzt verbinden</Text>
            </TouchableOpacity>
          )}
          
          {isSupabaseInitialized() && (
            <View style={styles.connectedIndicator}>
              <Icon name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.connectedText}>Verbunden</Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Icon name="information-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.infoText}>
            Ohne Supabase-Verbindung funktioniert die App nur mit lokalen Mock-Daten. 
            Benutzeranmeldung und persistente Datenspeicherung sind nicht verfügbar.
          </Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Admin-Funktionen</Text>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Icon name="shield-checkmark" size={20} color={colors.accent} />
            <Text style={styles.featureText}>Event-Moderation</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="person-remove" size={20} color={colors.accent} />
            <Text style={styles.featureText}>Benutzer-Verwaltung</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="flag" size={20} color={colors.accent} />
            <Text style={styles.featureText}>Meldungen bearbeiten</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="analytics" size={20} color={colors.accent} />
            <Text style={styles.featureText}>Statistiken einsehen</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Moderation & Verwaltung</Text>
        </View>
        <View style={styles.adminBadge}>
          <Icon name="shield" size={20} color={colors.accent} />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.length}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.filter(e => e.reported).length}</Text>
          <Text style={styles.statLabel}>Gemeldet</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{new Set(events.map(e => e.authorId)).size}</Text>
          <Text style={styles.statLabel}>Benutzer</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Meldungen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Einstellungen
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'events' && renderEventsTab()}
      {activeTab === 'reports' && renderReportsTab()}
      {activeTab === 'settings' && renderSettingsTab()}

      <SupabaseConnectionSheet
        isVisible={isSupabaseSheetVisible}
        onClose={() => setIsSupabaseSheetVisible(false)}
        onConnected={handleSupabaseConnected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    color: colors.grey,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.accent,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  eventContainer: {
    marginBottom: 8,
  },
  adminActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  adminButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: colors.grey,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  settingsSection: {
    padding: 16,
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsCardText: {
    flex: 1,
    marginLeft: 12,
  },
  settingsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingsCardSubtitle: {
    fontSize: 12,
    color: colors.grey,
    lineHeight: 16,
  },
  connectButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  connectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accent + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
    marginLeft: 8,
  },
  featureList: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default AdminScreen;
