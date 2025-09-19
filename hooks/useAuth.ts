
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSupabase, isSupabaseInitialized } from '../utils/supabase';
import { User } from '../types/Event';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  city?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, user not authenticated');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User authenticated:', user.email);
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Benutzer',
          city: user.user_metadata?.city || ''
        });
        setIsAuthenticated(true);
      } else {
        console.log('No authenticated user found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, city: string) => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden. Bitte verbinden Sie sich zuerst mit Ihrem Projekt.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    setLoading(true);
    try {
      console.log('Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            city
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        Alert.alert('Registrierung fehlgeschlagen', error.message);
        return { success: false };
      }

      if (data.user) {
        console.log('User signed up successfully:', data.user.email);
        Alert.alert(
          'Registrierung erfolgreich',
          'Bitte überprüfen Sie Ihre E-Mail für den Bestätigungslink.'
        );
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden. Bitte verbinden Sie sich zuerst mit Ihrem Projekt.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    setLoading(true);
    try {
      console.log('Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        Alert.alert('Anmeldung fehlgeschlagen', error.message);
        return { success: false };
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.email);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Benutzer',
          city: data.user.user_metadata?.city || ''
        });
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, clearing local auth state');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    }

    const supabase = getSupabase();
    if (!supabase) {
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    }

    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        Alert.alert('Abmeldung fehlgeschlagen', error.message);
        return { success: false };
      }

      console.log('User signed out successfully');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    }
  };

  const deleteAccount = async () => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase || !user) return { success: false };

    return new Promise((resolve) => {
      Alert.alert(
        'Konto löschen',
        'Sind Sie sicher, dass Sie Ihr Konto und alle Ihre Daten dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
        [
          {
            text: 'Abbrechen',
            style: 'cancel',
            onPress: () => resolve({ success: false })
          },
          {
            text: 'Löschen',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              try {
                console.log('Deleting user account:', user.id);
                
                // First delete all user data from custom tables
                // This would include events, comments, favorites, etc.
                const { error: dataError } = await supabase
                  .from('user_data')
                  .delete()
                  .eq('user_id', user.id);

                if (dataError) {
                  console.error('Error deleting user data:', dataError);
                }

                // Delete the user account
                const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
                
                if (deleteError) {
                  console.error('Delete account error:', deleteError);
                  Alert.alert('Fehler', 'Konto konnte nicht gelöscht werden: ' + deleteError.message);
                  resolve({ success: false });
                  return;
                }

                console.log('User account deleted successfully');
                setUser(null);
                setIsAuthenticated(false);
                Alert.alert('Konto gelöscht', 'Ihr Konto und alle Daten wurden erfolgreich gelöscht.');
                resolve({ success: true });
              } catch (error) {
                console.error('Delete account error:', error);
                Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
                resolve({ success: false });
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    });
  };

  const updateProfile = async (name: string, city: string) => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase || !user) return { success: false };

    setLoading(true);
    try {
      console.log('Updating user profile:', user.id);
      const { error } = await supabase.auth.updateUser({
        data: { name, city }
      });

      if (error) {
        console.error('Update profile error:', error);
        Alert.alert('Fehler', 'Profil konnte nicht aktualisiert werden: ' + error.message);
        return { success: false };
      }

      console.log('Profile updated successfully');
      setUser({ ...user, name, city });
      Alert.alert('Erfolg', 'Profil wurde erfolgreich aktualisiert.');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    updateProfile,
    checkAuthStatus
  };
};
