
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import ProfileSettingsSheet from '../../components/ProfileSettingsSheet';
import AppStatusCard from '../../components/AppStatusCard';
import EventCard from '../../components/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';
import { commonStyles, colors } from '../../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Add padding to account for tab bar
  },
  profileSection: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  profileCity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  primaryActionButtonText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  eventsContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default function ProfileScreen() {
  const { events, deleteEvent } = useEvents();
  const { user, signOut } = useAuth();
  const { users } = useUsers();
  const [showSettings, setShowSettings] = useState(false);
  const insets = useSafeAreaInsets();

  if (!user) {
    router.replace('/auth');
    return null;
  }

  const userEvents = events.filter(event => event.authorId === user.id);
  const upcomingUserEvents = userEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/auth');
            }
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mein Profil</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowSettings(true)}
        >
          <Icon name="settings" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user.name || 'User')}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <Text style={styles.profileCity}>📍 {user.city || 'Keine Stadt angegeben'}</Text>
                {user.isAdmin && (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Administrator</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={() => setShowSettings(true)}
              >
                <Icon name="edit" size={16} color="white" />
                <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                  Bearbeiten
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
                <Icon name="log-out" size={16} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Abmelden
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Status Card */}
          <AppStatusCard
            eventsCount={events.length}
            usersCount={users.length}
            isAdmin={user.isAdmin || false}
            onPress={() => router.push('/impressum')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/index')}
          >
            <Icon name="plus" size={24} color={colors.primary} style={styles.quickActionIcon} />
            <Text style={styles.quickActionText}>Neues Event erstellen</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/past-events')}
          >
            <Icon name="clock" size={24} color={colors.primary} style={styles.quickActionIcon} />
            <Text style={styles.quickActionText}>Vergangene Events</Text>
          </TouchableOpacity>
          {user.isAdmin && (
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/admin')}
            >
              <Icon name="shield" size={24} color={colors.primary} style={styles.quickActionIcon} />
              <Text style={styles.quickActionText}>Admin-Bereich</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Events */}
        <Text style={styles.sectionTitle}>Meine Veranstaltungen ({userEvents.length})</Text>
        
        <View style={styles.eventsContainer}>
          {upcomingUserEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Sie haben noch keine kommenden Veranstaltungen erstellt.
                {'\n\n'}
                Tippen Sie auf das + Symbol, um Ihre erste Veranstaltung zu erstellen!
              </Text>
            </View>
          ) : (
            upcomingUserEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}`)}
                onLike={() => {}}
                showActions={true}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Profile Settings Sheet */}
      <ProfileSettingsSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
}
