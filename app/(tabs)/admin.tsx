
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import SupabaseConnectionSheet from '../../components/SupabaseConnectionSheet';
import EventCard from '../../components/EventCard';
import UserManagementSheet from '../../components/UserManagementSheet';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';
import { commonStyles, colors } from '../../styles/commonStyles';
import { isSupabaseInitialized } from '../../utils/supabase';

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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  backButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  userCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: colors.primary + '20',
  },
  bannedBadge: {
    backgroundColor: colors.error + '20',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  adminBadgeText: {
    color: colors.primary,
  },
  bannedBadgeText: {
    color: colors.error,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  userActionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  unauthorizedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  unauthorizedText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectionStatusText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
});

export default function AdminScreen() {
  const { events, loading: eventsLoading, refreshEvents, deleteEvent } = useEvents();
  const { user, isAuthenticated, updateUserRole, banUser } = useAuth();
  const { users, loading: usersLoading, refreshUsers } = useUsers();
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'settings'>('events');
  const [showSupabaseSheet, setShowSupabaseSheet] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Refresh data when component mounts
    if (user?.isAdmin) {
      refreshEvents();
      refreshUsers();
    }
  }, [user?.isAdmin]);

  // Check if user is admin
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Admin-Bereich</Text>
            <Text style={styles.headerSubtitle}>Zugriff verweigert</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
        
        <View style={styles.unauthorizedContainer}>
          <Icon name="shield-off" size={80} color={colors.textSecondary} />
          <Text style={styles.unauthorizedText}>
            Sie haben keine Berechtigung für den Admin-Bereich.
            {'\n\n'}
            Nur Administratoren können auf diese Seite zugreifen. Wenden Sie sich an einen Administrator, um Ihre Berechtigung zu erhalten.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    if (activeTab === 'events') {
      await refreshEvents();
    } else if (activeTab === 'users') {
      await refreshUsers();
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  const handlePromoteUser = async (userId: string, currentIsAdmin: boolean) => {
    const action = currentIsAdmin ? 'zurückstufen' : 'befördern';
    Alert.alert(
      'Benutzerrolle ändern',
      `Möchten Sie diesen Benutzer wirklich ${action}?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: action === 'befördern' ? 'Befördern' : 'Zurückstufen',
          onPress: async () => {
            const result = await updateUserRole(userId, !currentIsAdmin);
            if (result.success) {
              await refreshUsers();
            }
          }
        }
      ]
    );
  };

  const handleBanUser = async (userId: string, currentIsBanned: boolean) => {
    const action = currentIsBanned ? 'entsperren' : 'sperren';
    Alert.alert(
      'Benutzer sperren/entsperren',
      `Möchten Sie diesen Benutzer wirklich ${action}?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: action === 'sperren' ? 'Sperren' : 'Entsperren',
          style: action === 'sperren' ? 'destructive' : 'default',
          onPress: async () => {
            const result = await banUser(userId, !currentIsBanned);
            if (result.success) {
              await refreshUsers();
            }
          }
        }
      ]
    );
  };

  const handleSupabaseConnected = () => {
    setShowSupabaseSheet(false);
    // Refresh data after connection
    refreshEvents();
    refreshUsers();
  };

  const renderEventsTab = () => {
    const totalEvents = events.length;
    const recentEvents = events.filter(event => {
      const eventDate = new Date(event.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return eventDate >= weekAgo;
    }).length;

    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).length;

    return (
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={eventsLoading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veranstaltungsstatistiken</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalEvents}</Text>
              <Text style={styles.statLabel}>Gesamt</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{upcomingEvents}</Text>
              <Text style={styles.statLabel}>Kommend</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{recentEvents}</Text>
              <Text style={styles.statLabel}>Diese Woche</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Alle Veranstaltungen verwalten</Text>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Noch keine Veranstaltungen vorhanden.
                {'\n\n'}
                Sobald Benutzer Veranstaltungen erstellen, können Sie diese hier verwalten.
              </Text>
            </View>
          ) : (
            events.map((event) => (
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
    );
  };

  const renderUsersTab = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.is_admin).length;
    const bannedUsers = users.filter(user => user.is_banned).length;

    return (
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benutzerstatistiken</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalUsers}</Text>
              <Text style={styles.statLabel}>Gesamt</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{adminUsers}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{bannedUsers}</Text>
              <Text style={styles.statLabel}>Gesperrt</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Benutzerverwaltung</Text>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="users" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Noch keine Benutzer registriert.
                {'\n\n'}
                Sobald sich Benutzer registrieren, können Sie diese hier verwalten.
              </Text>
            </View>
          ) : (
            users.slice(0, 10).map((userProfile) => (
              <View key={userProfile.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userEmail}>{userProfile.email}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    {userProfile.is_admin && (
                      <View style={[styles.userBadge, styles.adminBadge]}>
                        <Text style={[styles.badgeText, styles.adminBadgeText]}>
                          Admin
                        </Text>
                      </View>
                    )}
                    {userProfile.is_banned && (
                      <View style={[styles.userBadge, styles.bannedBadge]}>
                        <Text style={[styles.badgeText, styles.bannedBadgeText]}>
                          Gesperrt
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.userActionButton}
                    onPress={() => handlePromoteUser(userProfile.user_id, userProfile.is_admin)}
                  >
                    <Icon 
                      name={userProfile.is_admin ? "user-minus" : "user-plus"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.userActionButton}
                    onPress={() => handleBanUser(userProfile.user_id, userProfile.is_banned)}
                  >
                    <Icon 
                      name={userProfile.is_banned ? "unlock" : "lock"} 
                      size={16} 
                      color={userProfile.is_banned ? colors.success : colors.error} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          {users.length > 10 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowUserManagement(true)}
            >
              <Icon name="users" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>
                Alle {users.length} Benutzer anzeigen
              </Text>
              <Icon name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderSettingsTab = () => {
    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Systemeinstellungen</Text>
          
          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <Icon 
              name={isSupabaseInitialized() ? "check-circle" : "alert-circle"} 
              size={20} 
              color={isSupabaseInitialized() ? colors.success : colors.warning} 
            />
            <Text style={styles.connectionStatusText}>
              Supabase: {isSupabaseInitialized() ? 'Verbunden' : 'Nicht verbunden'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSupabaseSheet(true)}
          >
            <Icon name="database" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              Supabase-Verbindung {isSupabaseInitialized() ? 'verwalten' : 'einrichten'}
            </Text>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowUserManagement(true)}
          >
            <Icon name="users" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              Erweiterte Benutzerverwaltung
            </Text>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'System-Information',
                `Veranstaltungen: ${events.length}\nBenutzer: ${users.length}\nAdmins: ${users.filter(u => u.is_admin).length}\n\nVersion: 1.0.0\nSupabase: ${isSupabaseInitialized() ? 'Aktiv' : 'Inaktiv'}`,
                [{ text: 'OK' }]
              );
            }}
          >
            <Icon name="info" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              System-Information
            </Text>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin-Bereich</Text>
          <Text style={styles.headerSubtitle}>
            Veranstaltungen und Benutzer verwalten
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Veranstaltungen
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
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Einstellungen
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'events' && renderEventsTab()}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'settings' && renderSettingsTab()}

      {/* Supabase Connection Sheet */}
      <SupabaseConnectionSheet
        isVisible={showSupabaseSheet}
        onClose={() => setShowSupabaseSheet(false)}
        onConnected={handleSupabaseConnected}
      />

      {/* User Management Sheet */}
      <UserManagementSheet
        isVisible={showUserManagement}
        onClose={() => setShowUserManagement(false)}
      />
    </SafeAreaView>
  );
}
