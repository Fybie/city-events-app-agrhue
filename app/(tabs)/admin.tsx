
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EventCard from '../../components/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { adminUser } from '../../data/mockData';
import { Platform } from 'react-native';

const AdminScreen = () => {
  const { events, deleteEvent, likeEvent, reportEvent, isFavorite, toggleFavorite } = useEvents();
  const [activeTab, setActiveTab] = useState<'events' | 'reports'>('events');
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
            Alle Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Gemeldete Events
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {(activeTab === 'events' ? events : events.filter(e => e.reported)).map((event) => (
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

        {(activeTab === 'reports' ? events.filter(e => e.reported) : events).length === 0 && (
          <View style={styles.emptyState}>
            <Icon 
              name={activeTab === 'events' ? 'calendar-outline' : 'flag-outline'} 
              size={64} 
              color={colors.grey} 
            />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'events' ? 'Keine Events' : 'Keine Meldungen'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'events' 
                ? 'Es wurden noch keine Events erstellt.'
                : 'Es liegen keine gemeldeten Events vor.'
              }
            </Text>
          </View>
        )}
      </ScrollView>
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
});

export default AdminScreen;
