
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import CreateEventSheet from '../../components/CreateEventSheet';
import ShareEventSheet from '../../components/ShareEventSheet';
import EventCard from '../../components/EventCard';
import LocationFilter from '../../components/LocationFilter';
import OfflineIndicator from '../../components/OfflineIndicator';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors } from '../../styles/commonStyles';
import { isSupabaseInitialized } from '../../utils/supabase';
import { Event } from '../../types/Event';

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
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 90, // Position above tab bar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeCard: {
    backgroundColor: colors.primary + '10',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default function EventsScreen() {
  console.log('🏠 EventsScreen rendering...');
  
  const { events, loading, refreshEvents, createEvent, deleteEvent, likeEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>('Alle Städte');
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [selectedEventForShare, setSelectedEventForShare] = useState<Event | null>(null);
  const insets = useSafeAreaInsets();

  console.log('✅ EventsScreen hooks initialized successfully');
  console.log('📊 Events loaded:', events?.length || 0);
  console.log('👤 User authenticated:', isAuthenticated, user?.name || 'No user');

  // If user is not authenticated, redirect to auth screen
  if (!isAuthenticated) {
    router.replace('/auth');
    return null;
  }

  const filteredEvents = events.filter(event => {
    if (selectedLocation === 'Alle Städte') return true;
    return event.city === selectedLocation;
  });

  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const pastEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  const onRefresh = async () => {
    await refreshEvents();
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = async (eventData: any) => {
    if (!user) {
      Alert.alert('Fehler', 'Benutzerinformationen nicht verfügbar.');
      return;
    }

    const result = await createEvent({
      ...eventData,
      author: user.name || 'Unbekannt',
      authorId: user.id,
    });

    if (result.success) {
      setShowCreateSheet(false);
    }
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleLikeEvent = async (eventId: string) => {
    if (!user) {
      Alert.alert('Fehler', 'Benutzerinformationen nicht verfügbar.');
      return;
    }

    await likeEvent(eventId, user.id);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  const handleShareEvent = (event: Event) => {
    setSelectedEventForShare(event);
    setShowShareSheet(true);
  };

  const canDeleteEvent = (event: any) => {
    return user && (user.id === event.authorId || user.isAdmin);
  };

  const availableLocations = ['Alle Städte', ...Array.from(new Set(events.map(event => event.city)))];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Veranstaltungskalender</Text>
          <Text style={styles.headerSubtitle}>
            Willkommen, {user?.name || 'Benutzer'}! • {upcomingEvents.length} kommende Events
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Icon name="user" size={20} color={colors.primary} />
          </TouchableOpacity>
          {user?.isAdmin && (
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => router.push('/(tabs)/admin')}
            >
              <Icon name="settings" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Location Filter */}
        <View style={styles.filterContainer}>
          <LocationFilter
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            availableLocations={availableLocations}
          />
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.eventsContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card for new users */}
          {events.length === 0 && (
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>
                Willkommen beim städtischen Veranstaltungskalender!
              </Text>
              <Text style={styles.welcomeText}>
                Hier können Sie lokale Veranstaltungen entdecken, eigene Events erstellen und sich mit anderen Bürgern vernetzen. 
                {user?.isAdmin ? ' Als Administrator können Sie alle Veranstaltungen verwalten und per E-Mail teilen.' : ' Tippen Sie auf das + Symbol, um eine neue Veranstaltung zu erstellen.'}
              </Text>
            </View>
          )}

          {/* Statistics */}
          {events.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
                <Text style={styles.statLabel}>Kommende Events</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{pastEvents.length}</Text>
                <Text style={styles.statLabel}>Vergangene Events</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{availableLocations.length - 1}</Text>
                <Text style={styles.statLabel}>Städte</Text>
              </View>
            </View>
          )}

          {/* Upcoming Events */}
          <Text style={styles.sectionTitle}>Kommende Veranstaltungen</Text>
          
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {selectedLocation === 'Alle Städte' 
                  ? 'Keine kommenden Veranstaltungen gefunden.\n\nSeien Sie der Erste und erstellen Sie eine neue Veranstaltung!'
                  : `Keine Veranstaltungen in ${selectedLocation} gefunden.\n\nWählen Sie eine andere Stadt oder erstellen Sie eine neue Veranstaltung.`
                }
              </Text>
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
                onLike={() => handleLikeEvent(event.id)}
                showActions={canDeleteEvent(event) || user?.isAdmin}
                onDelete={canDeleteEvent(event) ? () => handleDeleteEvent(event.id) : undefined}
                onShare={user?.isAdmin ? () => handleShareEvent(event) : undefined}
                isAdmin={user?.isAdmin}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Create Event FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateSheet(true)}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Event Sheet */}
      <CreateEventSheet
        isVisible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreateEvent={handleCreateEvent}
      />

      {/* Share Event Sheet */}
      <ShareEventSheet
        isVisible={showShareSheet}
        onClose={() => {
          setShowShareSheet(false);
          setSelectedEventForShare(null);
        }}
        event={selectedEventForShare}
        senderName={user?.name || 'Administrator'}
      />
    </SafeAreaView>
  );
}
