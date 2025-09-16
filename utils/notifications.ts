
/**
 * Push Notification Service for Event Favorites
 * 
 * This service handles:
 * - Requesting notification permissions from the user
 * - Scheduling push notifications for favorited events (1 hour before event start)
 * - Managing notification tokens for push delivery
 * - Cancelling notifications when events are unfavorited
 * 
 * Features:
 * - Automatic permission request on app start
 * - Smart scheduling (won't schedule for past events)
 * - Notification channels for Android
 * - Deep linking to event details when notification is tapped
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Event } from '../types/Event';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    console.log('Requesting notification permissions...');
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    console.log('Notification permission status:', finalStatus);
    return finalStatus === 'granted';
  }

  static async getPushToken(): Promise<string | null> {
    try {
      console.log('Getting push token...');
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token obtained:', token);
      return token;
    } catch (error) {
      console.log('Error getting push token:', error);
      return null;
    }
  }

  static async scheduleEventNotification(event: Event): Promise<string | null> {
    try {
      console.log('Scheduling notification for event:', event.title);
      
      // Parse event date and time
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      
      // Schedule notification 1 hour before the event
      const notificationTime = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
      
      // Don't schedule if the notification time is in the past
      if (notificationTime <= new Date()) {
        console.log('Event is too soon, not scheduling notification');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Veranstaltung beginnt bald! 🎉',
          body: `${event.title} beginnt in einer Stunde in ${event.location}`,
          data: { 
            eventId: event.id,
            type: 'event_reminder'
          },
        },
        trigger: {
          date: notificationTime,
        },
      });

      console.log('Notification scheduled with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.log('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      console.log('Cancelling notification:', notificationId);
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Error cancelling notification:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      console.log('Cancelling all notifications');
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error cancelling all notifications:', error);
    }
  }

  static async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', notifications.length);
      return notifications;
    } catch (error) {
      console.log('Error getting scheduled notifications:', error);
      return [];
    }
  }
}
