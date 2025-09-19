
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import ProfileSettingsSheet from '../../components/ProfileSettingsSheet';
import EventCard from '../../components/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Add padding to account for tab bar
  },
  profileSection: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default function ProfileScreen() {
  const { events, deleteEvent } = useEvents();
  const { user, signOut } = useAuth();
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const insets = useSafeAreaInsets();

  // If user is not authenticated, redirect to auth screen
  if (!user) {
    router.replace('/auth');
    return null;
  }

  const userEvents = events.filter(event => event.authorId === user.id);
  const totalLikes = userEvents.reduce((sum, event) => sum + event.likes, 0);

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
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowSettingsSheet(true)}
        >
          <Icon name="settings" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user.name || 'U')}
              </Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.isAdmin && (
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>Administrator</Text>
              </View>
            )}
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userEvents.length}</Text>
              <Text style={styles.statLabel}>Veranstaltungen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalLikes}</Text>
              <Text style={styles.statLabel}>Likes erhalten</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.city || 'Keine'}</Text>
              <Text style={styles.statLabel}>Stadt</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        {user.isAdmin && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/admin')}
          >
            <Icon name="shield" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Admin-Bereich</Text>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowSettingsSheet(true)}
        >
          <Icon name="user" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Profil bearbeiten</Text>
          <Icon name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSignOut}
        >
          <Icon name="log-out" size={20} color={colors.error} />
          <Text style={[styles.actionButtonText, { color: colors.error }]}>Abmelden</Text>
          <Icon name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* User's Events */}
        <Text style={styles.sectionTitle}>Meine Veranstaltungen</Text>
        <View style={styles.eventsContainer}>
          {userEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Sie haben noch keine Veranstaltungen erstellt.
              </Text>
            </View>
          ) : (
            userEvents.map((event) => (
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

      <ProfileSettingsSheet
        isVisible={showSettingsSheet}
        onClose={() => setShowSettingsSheet(false)}
      />
    </SafeAreaView>
  );
}
