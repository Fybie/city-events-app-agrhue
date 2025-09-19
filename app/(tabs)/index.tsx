
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import Icon from '../../components/Icon';
import CreateEventSheet from '../../components/CreateEventSheet';
import EventCard from '../../components/EventCard';
import LocationFilter from '../../components/LocationFilter';
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});

export default function EventsScreen() {
  console.log('🏠 EventsScreen rendering...');
  
  // Always call hooks at the top level
  const { events, loading, refreshEvents, createEvent, deleteEvent, likeEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>('Alle Städte');
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const insets = useSafeAreaInsets();

  console.log('✅ EventsScreen hooks initialized successfully');
  console.log('📊 Events loaded:', events?.length || 0);
  console.log('👤 User authenticated:', isAuthenticated, user?.name || 'No user');

  // If user is not authenticated, redirect to auth screen
  if (!isAuthenticated) {
    router.replace('/auth');
    return null;
  }

  try {
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

    const canDeleteEvent = (event: any) => {
      return user && (user.id === event.authorId || user.isAdmin);
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
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Icon name="user" size={18} color={colors.primary} />
            </TouchableOpacity>
            {user?.isAdmin && (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => router.push('/(tabs)/admin')}
              >
                <Icon name="settings" size={18} color={colors.primary} />
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
