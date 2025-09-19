
import { Tabs } from 'expo-router';
import { colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Berechne die optimale Tab-Bar-Höhe basierend auf der Safe Area
  const tabBarHeight = Platform.OS === 'ios' ? 50 + Math.max(insets.bottom - 10, 0) : 60;
  const paddingBottom = Platform.OS === 'ios' ? Math.max(insets.bottom - 15, 5) : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.grey + '40',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Verbesserte Schatten für bessere Sichtbarkeit
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="past-events"
        options={{
          title: 'Berichte',
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
