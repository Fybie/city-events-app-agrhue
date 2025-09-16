
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useEvents } from '../../hooks/useEvents';
import EventCard from '../../components/EventCard';
import CreateEventSheet from '../../components/CreateEventSheet';
import Icon from '../../components/Icon';

export default function EventsScreen() {
  const { events, loading, addEvent, likeEvent, reportEvent } = useEvents();
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    console.log('Refreshing events...');
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEventPress = (eventId: string) => {
    console.log('Opening event details:', eventId);
    router.push(`/event/${eventId}`);
  };

  const handleCreateEvent = (eventData: any) => {
    addEvent(eventData);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreateSheetVisible(true)}
        >
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyText}>Noch keine Events vorhanden</Text>
            <Text style={styles.emptySubtext}>Erstelle das erste Event für deine Stadt!</Text>
          </View>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event.id)}
              onLike={() => likeEvent(event.id)}
              onReport={() => reportEvent(event.id)}
            />
          ))
        )}
      </ScrollView>

      <CreateEventSheet
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
        onCreateEvent={handleCreateEvent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
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
  },
});
