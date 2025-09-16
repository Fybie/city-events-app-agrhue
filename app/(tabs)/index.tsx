
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEvents } from '../../hooks/useEvents';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import EventCard from '../../components/EventCard';
import CreateEventSheet from '../../components/CreateEventSheet';
import LocationFilter from '../../components/LocationFilter';

const EventsScreen = () => {
  const {
    events,
    loading,
    selectedLocation,
    availableLocations,
    addEvent,
    likeEvent,
    reportEvent,
    setLocationFilter,
    isFavorite,
    toggleFavorite,
    hasNotificationPermission
  } = useEvents();

  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    console.log('Refreshing events');
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEventPress = (eventId: string) => {
    console.log('Opening event:', eventId);
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Creating event:', eventData);
    addEvent(eventData);
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location === 'Alle Orte' ? 'all' : location);
  };

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Events</Text>
          {!hasNotificationPermission && (
            <View style={styles.notificationWarning}>
              <Icon name="notifications-off-outline" size={16} color={colors.error} />
              <Text style={styles.notificationWarningText}>Push-Benachrichtigungen deaktiviert</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreateSheetVisible(true)}
        >
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <LocationFilter
          selectedLocation={selectedLocation === 'all' ? 'Alle Orte' : selectedLocation}
          onLocationChange={handleLocationChange}
          availableLocations={['Alle Orte', ...availableLocations]}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>Keine Events gefunden</Text>
            <Text style={styles.emptyStateText}>
              {selectedLocation !== 'all'
                ? 'Keine Events in dieser Stadt gefunden. Versuchen Sie einen anderen Ort oder erstellen Sie das erste Event!'
                : 'Seien Sie der Erste, der ein Event erstellt!'
              }
            </Text>
          </View>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event.id)}
              onLike={() => likeEvent(event.id)}
              onFavorite={() => toggleFavorite(event)}
              isFavorite={isFavorite(event.id)}
              onReport={() => reportEvent(event.id)}
            />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <CreateEventSheet
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
        onCreateEvent={handleCreateEvent}
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  notificationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notificationWarningText: {
    color: colors.error,
    fontSize: 12,
    marginLeft: 4,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  content: {
    flex: 1,
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
  bottomSpacing: {
    height: 100,
  },
});

export default EventsScreen;
