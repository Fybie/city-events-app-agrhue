
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Redirect } from 'expo-router';
import { colors } from '../styles/commonStyles';
import { testConnection } from '../utils/supabase';
import Icon from '../components/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      console.log('🚀 App initializing...');
      
      // Test Supabase connection
      const connected = await testConnection();
      console.log('📡 Supabase connection:', connected ? 'OK' : 'Failed');
      
      // Small delay to show loading state
      setTimeout(() => {
        setInitializing(false);
      }, 1000);
    };

    initialize();
  }, []);

  // Show loading state while initializing or checking authentication
  if (initializing || loading) {
    return (
      <View style={styles.container}>
        <Icon name="calendar" size={64} color={colors.primary} />
        <Text style={styles.loadingText}>Veranstaltungskalender wird geladen...</Text>
      </View>
    );
  }

  // If user is authenticated, go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not authenticated, show auth screen
  return <Redirect href="/auth" />;
}
