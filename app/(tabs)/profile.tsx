
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import EventCard from '../../components/EventCard';
import AuthSheet from '../../components/AuthSheet';
import ProfileSettingsSheet from '../../components/ProfileSettingsSheet';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { currentUser } from '../../data/mockData';
import { Platform } from 'react-native';
import { isSupabaseInitialized } from '../../utils/supabase';

const ProfileScreen = () => {
  const { events, deleteEvent, likeEvent, reportEvent, isFavorite, toggleFavorite } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created');
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const insets = useSafeAreaInsets();

  // Calculate bottom spacing for tab bar
  const tabBarHeight = Platform.OS === 'ios' ? 50 + Math.max(insets.bottom - 10, 0) : 60;

  // Use authenticated user or fallback to mock user
  const displayUser = isAuthenticated && user ? user : currentUser;
  const userId = isAuthenticated && user ? user.id : currentUser.id;

  // Filter events based on current user
  const userEvents = events.filter(event => event.authorId === userId);
  const favoriteEvents = events.filter(event => isFavorite(event.id));

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('Deleting event:', eventId);
            deleteEvent(eventId);
          }
        }
      ]
    );
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      setShowSettingsSheet(true);
    } else {
      if (!isSupabaseInitialized()) {
        Alert.alert(
          'Supabase Required',
          'To sign in or register, you need to enable Supabase first. Press the Supabase button and connect to your project.',
          [{ text: 'OK' }]
        );
        return;
      }
      setShowAuthSheet(true);
    }
  };

  const displayEvents = activeTab === 'created' ? userEvents : favoriteEvents;

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleAuthAction} style={styles.settingsButton}>
          <Icon 
            name={isAuthenticated ? "settings-outline" : "log-in-outline"} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color="white" />
        </View>
        <Text style={styles.userName}>{displayUser.name}</Text>
        <Text style={styles.userEmail}>
          {isAuthenticated && user ? user.email : displayUser.email}
        </Text>
        {!isAuthenticated && (
          <TouchableOpacity 
            style={styles.loginPrompt}
            onPress={handleAuthAction}
          >
            <Text style={styles.loginPromptText}>
              Sign in now for full features
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'created' && styles.activeTab]}
          onPress={() => setActiveTab('created')}
        >
          <Text style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}>
            My Events ({userEvents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favorites ({favoriteEvents.length})
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
              {activeTab === 'created' ? 'No Events Created' : 'No Favorites'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'created' 
                ? 'You haven\'t created any events yet. Create your first event!'
                : 'You haven\'t favorited any events yet. Mark events as favorites!'
              }
            </Text>
          </View>
        ) : (
          displayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => {
                console.log('Event pressed:', event.id);
                router.push(`/event/${event.id}`);
              }}
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

      <AuthSheet 
        isVisible={showAuthSheet} 
        onClose={() => setShowAuthSheet(false)} 
      />

      <ProfileSettingsSheet 
        isVisible={showSettingsSheet} 
        onClose={() => setShowSettingsSheet(false)} 
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
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 8,
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
    marginBottom: 8,
  },
  loginPrompt: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  loginPromptText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '500',
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
