
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CenteredAuthForm from '../components/CenteredAuthForm';
import { colors } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    minHeight: screenHeight,
  },
});

export default function AuthScreen() {
  const { isAuthenticated, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();
  }, []);

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
      <View style={styles.content}>
        <CenteredAuthForm onAuthSuccess={handleAuthSuccess} />
      </View>
    </SafeAreaView>
  );
}
