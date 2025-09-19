
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CenteredAuthForm from '../components/CenteredAuthForm';
import { colors } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default function AuthScreen() {
  const { isAuthenticated } = useAuth();

  const handleAuthSuccess = () => {
    console.log('✅ Authentication successful, redirecting to main app');
    router.replace('/(tabs)');
  };

  // If user is already authenticated, redirect to main app
  if (isAuthenticated) {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <CenteredAuthForm onAuthSuccess={handleAuthSuccess} />
    </SafeAreaView>
  );
}
