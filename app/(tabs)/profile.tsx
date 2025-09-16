
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useEvents } from '../../hooks/useEvents';
import { currentUser } from '../../data/mockData';
import EventCard from '../../components/EventCard';
import Icon from '../../components/Icon';

export default function ProfileScreen() {
  const { events, getEventsByUser, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState<'events' | 'settings'>('events');
  
  const userEvents = getEventsByUser(currentUser.id);

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Event löschen',
      'Möchten Sie dieses Event wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            console.log('Deleting user event:', eventId);
            deleteEvent(eventId);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={32} color={colors.text} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userCity}>{currentUser.city}</Text>
            <Text style={styles.userStats}>
              {userEvents.length} Events erstellt
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Meine Events
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'events' ? (
          userEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={64} color={colors.grey} />
              <Text style={styles.emptyText}>Noch keine Events erstellt</Text>
              <Text style={styles.emptySubtext}>
                Erstelle dein erstes Event auf der Hauptseite!
              </Text>
            </View>
          ) : (
            userEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => console.log('Event details:', event.id)}
                onLike={() => console.log('Like own event')}
                showActions={false}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))
          )
        ) : (
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="notifications-outline" size={24} color={colors.text} />
              <Text style={styles.settingText}>Benachrichtigungen</Text>
              <Icon name="chevron-forward" size={20} color={colors.grey} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="location-outline" size={24} color={colors.text} />
              <Text style={styles.settingText}>Stadt ändern</Text>
              <Icon name="chevron-forward" size={20} color={colors.grey} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="help-circle-outline" size={24} color={colors.text} />
              <Text style={styles.settingText}>Hilfe & Support</Text>
              <Icon name="chevron-forward" size={20} color={colors.grey} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="information-circle-outline" size={24} color={colors.text} />
              <Text style={styles.settingText}>Über die App</Text>
              <Icon name="chevron-forward" size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userCity: {
    color: colors.grey,
    fontSize: 16,
    marginBottom: 4,
  },
  userStats: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 14,
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
    paddingHorizontal: 40,
  },
  settingsContainer: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});
