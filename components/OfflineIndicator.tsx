
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { isSupabaseInitialized } from '../utils/supabase';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  onlineContainer: {
    backgroundColor: colors.success + '20',
  },
  onlineText: {
    color: colors.success,
  },
});

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(isSupabaseInitialized());
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const checkConnection = () => {
      const connected = isSupabaseInitialized();
      setIsOnline(connected);
    };

    // Check connection every 5 seconds
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline) {
      // Fade out after 3 seconds when online
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Always show when offline
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline, opacity]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        isOnline && styles.onlineContainer,
        { opacity }
      ]}
    >
      <Icon 
        name={isOnline ? "wifi" : "wifi-off"} 
        size={18} 
        color={isOnline ? colors.success : colors.warning} 
      />
      <Text style={[styles.text, isOnline && styles.onlineText]}>
        {isOnline 
          ? 'Online - Alle Funktionen verfügbar' 
          : 'Offline-Modus - Eingeschränkte Funktionalität'
        }
      </Text>
    </Animated.View>
  );
}
