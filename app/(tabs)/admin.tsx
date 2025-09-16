
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useEvents } from '../../hooks/useEvents';
import { adminUser } from '../../data/mockData';
import EventCard from '../../components/EventCard';
import Icon from '../../components/Icon';

export default function AdminScreen() {
  const { events, users, getReportedEvents, deleteEvent, banUser } = useEvents();
  const [activeTab, setActiveTab] = useState<'reported' | 'users' | 'stats'>('reported');
  
  const reportedEvents = getReportedEvents();
  const totalEvents = events.length;
  const totalUsers = users.length;
  const bannedUsers = users.filter(user => user.isBanned);

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Event löschen',
      'Möchten Sie dieses gemeldete Event löschen?',
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
      `Möchten Sie ${userName} wirklich sperren?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Sperren', 
          style: 'destructive',
          onPress: () => {
            console.log('Admin banning user:', userId);
            banUser(userId);
          }
        }
      ]
    );
  };

  // Check if current user is admin
  if (!adminUser.isAdmin) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={styles.noAccessContainer}>
          <Icon name="shield-outline" size={64} color={colors.grey} />
          <Text style={styles.noAccessText}>Kein Admin-Zugang</Text>
          <Text style={styles.noAccessSubtext}>
            Sie haben keine Berechtigung für den Admin-Bereich.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.adminBadge}>
          <Icon name="shield" size={16} color={colors.text} />
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reported' && styles.activeTab]}
          onPress={() => setActiveTab('reported')}
        >
          <Text style={[styles.tabText, activeTab === 'reported' && styles.activeTabText]}>
            Gemeldet ({reportedEvents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Benutzer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistiken
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'reported' && (
          reportedEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="checkmark-circle-outline" size={64} color={colors.accent} />
              <Text style={styles.emptyText}>Keine gemeldeten Events</Text>
              <Text style={styles.emptySubtext}>Alle Events sind in Ordnung!</Text>
            </View>
          ) : (
            reportedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => console.log('View reported event:', event.id)}
                onLike={() => console.log('Admin like')}
                showActions={false}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))
          )
        )}

        {activeTab === 'users' && (
          <View style={styles.usersContainer}>
            {users.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <View style={styles.userAvatar}>
                  <Icon name="person" size={24} color={colors.text} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userItemName}>{user.name}</Text>
                  <Text style={styles.userItemCity}>{user.city}</Text>
                  <Text style={styles.userItemStats}>
                    {user.eventsCreated} Events erstellt
                  </Text>
                  {user.isBanned && (
                    <Text style={styles.bannedText}>GESPERRT</Text>
                  )}
                </View>
                {!user.isBanned && !user.isAdmin && (
                  <TouchableOpacity
                    style={styles.banButton}
                    onPress={() => handleBanUser(user.id, user.name)}
                  >
                    <Icon name="ban-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'stats' && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="calendar-outline" size={32} color={colors.accent} />
              <Text style={styles.statNumber}>{totalEvents}</Text>
              <Text style={styles.statLabel}>Gesamt Events</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="people-outline" size={32} color={colors.accent} />
              <Text style={styles.statNumber}>{totalUsers}</Text>
              <Text style={styles.statLabel}>Benutzer</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="flag-outline" size={32} color="#ff4444" />
              <Text style={styles.statNumber}>{reportedEvents.length}</Text>
              <Text style={styles.statLabel}>Gemeldete Events</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="ban-outline" size={32} color="#ff4444" />
              <Text style={styles.statNumber}>{bannedUsers.length}</Text>
              <Text style={styles.statLabel}>Gesperrte Benutzer</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noAccessText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  noAccessSubtext: {
    color: colors.grey,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  usersContainer: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userItemName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userItemCity: {
    color: colors.grey,
    fontSize: 14,
    marginBottom: 2,
  },
  userItemStats: {
    color: colors.accent,
    fontSize: 12,
  },
  bannedText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  banButton: {
    padding: 8,
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.backgroundAlt,
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
