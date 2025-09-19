
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import Icon from '../../components/Icon';
import CreateEventSheet from '../../components/CreateEventSheet';
import EventCard from '../../components/EventCard';
import LocationFilter from '../../components/LocationFilter';
import AuthSheet from '../../components/AuthSheet';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
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
  },
  connectionBanner: {
    backgroundColor: colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
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
});

export default function EventsScreen() {
  console.log('🏠 EventsScreen rendering...');
  
  try {
    const { events, loading, refreshEvents, createEvent, deleteEvent, likeEvent } = useEvents();
    const { user, isAuthenticated } = useAuth();
    const [selectedLocation, setSelectedLocation] = useState<string>('Alle Städte');
    const [showCreateSheet, setShowCreateSheet] = useState(false);
    const [showAuthSheet, setShowAuthSheet] = useState(false);
    const insets = useSafeAreaInsets();

    console.log('✅ EventsScreen hooks initialized successfully');
    console.log('📊 Events loaded:', events?.length || 0);
    console.log('👤 User authenticated:', isAuthenticated, user?.name || 'No user');

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

  const onRefresh = async () => {
    await refreshEvents();
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = async (eventData: any) => {
    if (!isAuthenticated || !user) {
      Alert.alert('Anmeldung erforderlich', 'Sie müssen angemeldet sein, um Veranstaltungen zu erstellen.');
      setShowAuthSheet(true);
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

  const handleAuthAction = () => {
    setShowAuthSheet(true);
  };

  const handleLikeEvent = async (eventId: string) => {
    if (!isAuthenticated || !user) {
      Alert.alert('Anmeldung erforderlich', 'Sie müssen angemeldet sein, um Veranstaltungen zu liken.');
      setShowAuthSheet(true);
      return;
    }

    await likeEvent(eventId, user.id);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  const canCreateEvent = isAuthenticated && user;
  const canDeleteEvent = (event: any) => {
    return isAuthenticated && user && (user.id === event.authorId || user.isAdmin);
  };

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Connection Banner */}
        {!isSupabaseInitialized() && (
          <View style={styles.connectionBanner}>
            <Icon name="alert-circle" size={20} color={colors.text} />
            <Text style={styles.connectionBannerText}>
              Offline-Modus: Verbinden Sie sich mit Supabase für vollständige Funktionalität
            </Text>
          </View>
        )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Veranstaltungskalender</Text>
          <Text style={styles.headerSubtitle}>
            {upcomingEvents.length} kommende Veranstaltungen
          </Text>
        </View>
        <View style={styles.headerButtons}>
          {!isAuthenticated ? (
            <TouchableOpacity style={styles.headerButton} onPress={handleAuthAction}>
              <Icon name="log-in" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Icon name="user" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
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
            availableLocations={['Alle Städte', ...Array.from(new Set(events.map(event => event.city)))]}
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
          <Text style={styles.sectionTitle}>Kommende Veranstaltungen</Text>
          
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {selectedLocation === 'Alle Städte' 
                  ? 'Keine kommenden Veranstaltungen gefunden'
                  : `Keine Veranstaltungen in ${selectedLocation} gefunden`
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
                showActions={canDeleteEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Create Event FAB */}
      {canCreateEvent && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCreateSheet(true)}
        >
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Create Event Sheet */}
      <CreateEventSheet
        isVisible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreateEvent={handleCreateEvent}
      />

      {/* Auth Sheet */}
      <AuthSheet
        isVisible={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
        />
      </SafeAreaView>
    );
  } catch (error) {
    console.error('❌ Error in EventsScreen:', error);
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.emptyStateText}>
            Ein Fehler ist aufgetreten. Bitte starten Sie die App neu.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
