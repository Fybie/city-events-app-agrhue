
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export const useNotificationListener = () => {
  useEffect(() => {
    // Handle notification received while app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle notification response (when user taps on notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      
      const eventId = response.notification.request.content.data?.eventId;
      if (eventId) {
        // Navigate to the event detail screen
        router.push(`/event/${eventId}`);
      }
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
};
