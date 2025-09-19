
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { colors } from '../styles/commonStyles';
import { setupErrorLogging } from '../utils/errorLogger';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary componentDidCatch:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 }}>
          <Text style={{ color: colors.error, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Etwas ist schiefgelaufen
          </Text>
          <Text style={{ color: colors.text, textAlign: 'center', lineHeight: 20 }}>
            Die App ist auf einen unerwarteten Fehler gestoßen. Bitte starten Sie die App neu.
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 20, textAlign: 'center' }}>
            {this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    console.log('🚀 App starting up...');
    
    // Setup error logging
    try {
      setupErrorLogging();
      console.log('✅ Error logging initialized');
    } catch (error) {
      console.error('❌ Failed to setup error logging:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="impressum" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
