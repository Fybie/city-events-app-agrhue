
import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();

  // If still loading, don't render anything
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to auth screen
  if (!isAuthenticated) {
    router.replace('/auth');
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Veranstaltungen',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="past-events"
        options={{
          title: 'Vergangene Events',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
          href: null, // Hide from tab bar by default
        }}
      />
    </Tabs>
  );
}
