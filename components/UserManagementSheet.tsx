
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import { colors } from '../styles/commonStyles';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

interface UserManagementSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  usersList: {
    maxHeight: 400,
  },
  userCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  userMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  userBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
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
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default function UserManagementSheet({ isVisible, onClose }: UserManagementSheetProps) {
  const { users, loading, refreshUsers } = useUsers();
  const { updateUserRole, banUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.is_admin).length;
  const bannedUsers = users.filter(user => user.is_banned).length;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Benutzerverwaltung</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="x" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
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

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Benutzer suchen..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="users" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Keine Benutzer gefunden' : 'Keine Benutzer vorhanden'}
              </Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userMeta}>
                    Registriert: {formatDate(user.created_at)} • {user.city || 'Keine Stadt'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    {user.is_admin && (
                      <View style={[styles.userBadge, styles.adminBadge]}>
                        <Text style={[styles.badgeText, styles.adminBadgeText]}>
                          Admin
                        </Text>
                      </View>
                    )}
                    {user.is_banned && (
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
                    style={styles.actionButton}
                    onPress={() => handlePromoteUser(user.user_id, user.is_admin)}
                  >
                    <Icon 
                      name={user.is_admin ? "user-minus" : "user-plus"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleBanUser(user.user_id, user.is_banned)}
                  >
                    <Icon 
                      name={user.is_banned ? "unlock" : "lock"} 
                      size={16} 
                      color={user.is_banned ? colors.success : colors.error} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SimpleBottomSheet>
  );
}
