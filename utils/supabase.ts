
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';

// These will be set when the user connects to Supabase
let supabaseUrl = '';
let supabaseAnonKey = '';
let supabase: any = null;

export const initializeSupabase = (url: string, key: string) => {
  console.log('Initializing Supabase with URL:', url);
  supabaseUrl = url;
  supabaseAnonKey = key;
  supabase = createClient(url, key);
  return supabase;
};

export const getSupabase = () => {
  if (!supabase) {
    console.log('Supabase not initialized');
    Alert.alert(
      'Supabase not connected',
      'Please connect to your Supabase project first using the Supabase button.'
    );
    return null;
  }
  return supabase;
};

export const isSupabaseInitialized = () => {
  return supabase !== null;
};
