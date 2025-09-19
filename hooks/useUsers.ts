
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSupabase, isSupabaseInitialized } from '../utils/supabase';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  city: string;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot load users');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    setLoading(true);
    try {
      console.log('Loading users from Supabase');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        Alert.alert('Fehler', 'Benutzer konnten nicht geladen werden.');
        return;
      }

      console.log('Users loaded successfully:', data?.length);
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  return {
    users,
    loading,
    loadUsers,
    refreshUsers
  };
};
