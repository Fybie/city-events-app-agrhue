
import { useState, useEffect } from 'react';
import { Event } from '../types/Event';
import { currentUser } from '../data/mockData';
import { NotificationService } from '../utils/notifications';

interface FavoriteEvent {
  eventId: string;
  notificationId?: string;
}

export const useFavorites = () => {
  const [favoriteEvents, setFavoriteEvents] = useState<FavoriteEvent[]>([]);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    console.log('Initializing notifications...');
    const hasPermission = await NotificationService.requestPermissions();
    setHasNotificationPermission(hasPermission);
    
    if (hasPermission) {
      const token = await NotificationService.getPushToken();
      if (token) {
        console.log('Push token ready for user:', currentUser.name);
        // In a real app, you would save this token to your backend
      }
    }
  };

  const isFavorite = (eventId: string): boolean => {
    return favoriteEvents.some(fav => fav.eventId === eventId);
  };

  const addToFavorites = async (event: Event): Promise<void> => {
    console.log('Adding event to favorites:', event.title);
    
    if (isFavorite(event.id)) {
      console.log('Event already in favorites');
      return;
    }

    let notificationId: string | undefined;
    
    if (hasNotificationPermission) {
      const scheduledId = await NotificationService.scheduleEventNotification(event);
      if (scheduledId) {
        notificationId = scheduledId;
        console.log('Notification scheduled for favorited event');
      }
    }

    const favoriteEvent: FavoriteEvent = {
      eventId: event.id,
      notificationId
    };

    setFavoriteEvents(prev => [...prev, favoriteEvent]);
  };

  const removeFromFavorites = async (eventId: string): Promise<void> => {
    console.log('Removing event from favorites:', eventId);
    
    const favoriteEvent = favoriteEvents.find(fav => fav.eventId === eventId);
    
    if (favoriteEvent?.notificationId) {
      await NotificationService.cancelNotification(favoriteEvent.notificationId);
      console.log('Cancelled notification for unfavorited event');
    }

    setFavoriteEvents(prev => prev.filter(fav => fav.eventId !== eventId));
  };

  const toggleFavorite = async (event: Event): Promise<void> => {
    if (isFavorite(event.id)) {
      await removeFromFavorites(event.id);
    } else {
      await addToFavorites(event);
    }
  };

  const getFavoriteEventIds = (): string[] => {
    return favoriteEvents.map(fav => fav.eventId);
  };

  const getFavoriteEvents = (allEvents: Event[]): Event[] => {
    const favoriteIds = getFavoriteEventIds();
    return allEvents.filter(event => favoriteIds.includes(event.id));
  };

  const clearAllFavorites = async (): Promise<void> => {
    console.log('Clearing all favorites');
    
    // Cancel all notifications for favorited events
    for (const favorite of favoriteEvents) {
      if (favorite.notificationId) {
        await NotificationService.cancelNotification(favorite.notificationId);
      }
    }
    
    setFavoriteEvents([]);
  };

  return {
    favoriteEvents: getFavoriteEventIds(),
    hasNotificationPermission,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoriteEvents,
    clearAllFavorites,
    initializeNotifications
  };
};
