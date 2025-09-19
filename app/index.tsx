
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null; // You could show a loading spinner here
  }

  // If user is authenticated, go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not authenticated, show auth screen
  return <Redirect href="/auth" />;
}
