
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';

// These will be set when the user connects to Supabase
let supabaseUrl = '';
let supabaseAnonKey = '';
let supabase: any = null;

export const initializeSupabase = (url: string, key: string) => {
  try {
    console.log('Initializing Supabase with URL:', url);
    supabaseUrl = url;
    supabaseAnonKey = key;
    supabase = createClient(url, key);
    console.log('✅ Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
    Alert.alert('Fehler', 'Supabase konnte nicht initialisiert werden: ' + error);
    return null;
  }
};

export const getSupabase = () => {
  try {
    if (!supabase) {
      console.log('Supabase not initialized');
      return null;
    }
    return supabase;
  } catch (error) {
    console.error('❌ Error getting Supabase client:', error);
    return null;
  }
};

export const isSupabaseInitialized = () => {
  return supabase !== null;
};
