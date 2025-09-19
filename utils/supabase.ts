
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';

// Supabase project configuration
const SUPABASE_URL = 'https://ortrizninrylodxerbkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydHJpem5pbnJ5bG9keGVyYmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTMxNjUsImV4cCI6MjA3MzYyOTE2NX0.__KWU4zIkHf34MG87FJQexNHalhBdXdUc9Vv1RbDyPE';

// Initialize Supabase client
let supabase: any = null;

try {
  console.log('🔗 Initializing Supabase client...');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Supabase:', error);
  Alert.alert('Fehler', 'Supabase konnte nicht initialisiert werden: ' + error);
}

export const initializeSupabase = (url?: string, key?: string) => {
  try {
    const finalUrl = url || SUPABASE_URL;
    const finalKey = key || SUPABASE_ANON_KEY;
    
    console.log('🔗 Re-initializing Supabase with URL:', finalUrl);
    supabase = createClient(finalUrl, finalKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
    console.log('✅ Supabase re-initialized successfully');
    return supabase;
  } catch (error) {
    console.error('❌ Error re-initializing Supabase:', error);
    Alert.alert('Fehler', 'Supabase konnte nicht initialisiert werden: ' + error);
    return null;
  }
};

export const getSupabase = () => {
  try {
    if (!supabase) {
      console.log('⚠️ Supabase not initialized, attempting to initialize...');
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        }
      });
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

// Test connection
export const testConnection = async () => {
  try {
    const client = getSupabase();
    if (!client) return false;
    
    const { data, error } = await client.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
};
