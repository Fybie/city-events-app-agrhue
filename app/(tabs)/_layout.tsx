
import React from 'react';
import { Tabs } from 'expo-router';
import Icon from '../../components/Icon';
import { colors } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  console.log('📱 TabLayout rendering...');
  
  try {
    const { user, isAuthenticated } = useAuth();
    console.log('✅ TabLayout auth hook initialized');

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
          fontWeight: '600',
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
            <Icon name="shield" size={size} color={color} />
          ),
          href: user?.isAdmin ? '/(tabs)/admin' : null,
        }}
        />
      </Tabs>
    );
  } catch (error) {
    console.error('❌ Error in TabLayout:', error);
    return null;
  }
}
