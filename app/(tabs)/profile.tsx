
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import EventCard from '../../components/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { currentUser } from '../../data/mockData';
import { Platform } from 'react-native';

const ProfileScreen = () => {
  const { events, deleteEvent, likeEvent, reportEvent, isFavorite, toggleFavorite } = useEvents();
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created');
  const insets = useSafeAreaInsets();

  // Berechne den unteren Abstand für die Tab-Bar
  const tabBarHeight = Platform.OS === 'ios' ? 50 + Math.max(insets.bottom - 10, 0) : 60;

  // Filter events based on current user
  const userEvents = events.filter(event => event.authorId === currentUser.id);
  const favoriteEvents = events.filter(event => isFavorite(event.id));

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Event löschen',
      'Sind Sie sicher, dass Sie dieses Event löschen möchten?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            console.log('Deleting event:', eventId);
            deleteEvent(eventId);
          }
        }
      ]
    );
  };

  const displayEvents = activeTab === 'created' ? userEvents : favoriteEvents;

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color={colors.text} />
        </View>
        <Text style={styles.userName}>{currentUser.name}</Text>
        <Text style={styles.userEmail}>{currentUser.email}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'created' && styles.activeTab]}
          onPress={() => setActiveTab('created')}
        >
          <Text style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}>
            Meine Events ({userEvents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favoriten ({favoriteEvents.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {displayEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon 
              name={activeTab === 'created' ? 'calendar-outline' : 'heart-outline'} 
              size={64} 
              color={colors.grey} 
            />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'created' ? 'Keine Events erstellt' : 'Keine Favoriten'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'created' 
                ? 'Sie haben noch keine Events erstellt. Erstellen Sie Ihr erstes Event!'
                : 'Sie haben noch keine Events favorisiert. Markieren Sie Events als Favoriten!'
              }
            </Text>
          </View>
        ) : (
          displayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => console.log('Event pressed:', event.id)}
              onLike={() => likeEvent(event.id)}
              onFavorite={() => toggleFavorite(event)}
              isFavorite={isFavorite(event.id)}
              showActions={activeTab === 'created'}
              onReport={() => reportEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
            />
          ))
        )}

        {/* Legal Section */}
        <View style={styles.legalSection}>
          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => {
              console.log('Navigating to Impressum');
              router.push('/impressum');
            }}
          >
            <Icon name="document-text-outline" size={20} color={colors.grey} />
            <Text style={styles.legalButtonText}>Impressum</Text>
            <Icon name="chevron-forward" size={16} color={colors.grey} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: colors.grey,
    fontSize: 14,
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
  legalSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '30',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  legalButtonText: {
    flex: 1,
    color: colors.grey,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;
