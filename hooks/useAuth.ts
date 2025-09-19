
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSupabase, isSupabaseInitialized } from '../utils/supabase';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  city?: string;
  isAdmin?: boolean;
}

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

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
        
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email || '',
          name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Benutzer',
          city: profile?.city || user.user_metadata?.city || '',
          isAdmin: profile?.is_admin || false
        };

        setUser(authUser);
        setUserProfile(profile);
        setIsAuthenticated(true);
      } else {
        console.log('No authenticated user found');
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setUserProfile(null);
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
          },
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        Alert.alert('Registrierung fehlgeschlagen', error.message);
        return { success: false };
      }

      if (data.user) {
        console.log('User signed up successfully:', data.user.email);
        
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            name,
            city,
            is_admin: false,
            is_banned: false
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

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
        
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Benutzer',
          city: profile?.city || data.user.user_metadata?.city || '',
          isAdmin: profile?.is_admin || false
        };

        setUser(authUser);
        setUserProfile(profile);
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
      setUserProfile(null);
      setIsAuthenticated(false);
      return { success: true };
    }

    const supabase = getSupabase();
    if (!supabase) {
      setUser(null);
      setUserProfile(null);
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
      setUserProfile(null);
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
                
                // Delete user profile (this will cascade to other tables due to foreign keys)
                const { error: profileError } = await supabase
                  .from('profiles')
                  .delete()
                  .eq('user_id', user.id);

                if (profileError) {
                  console.error('Error deleting user profile:', profileError);
                }

                // Sign out the user
                await supabase.auth.signOut();

                console.log('User account deleted successfully');
                setUser(null);
                setUserProfile(null);
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
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, city, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Update profile error:', profileError);
        Alert.alert('Fehler', 'Profil konnte nicht aktualisiert werden: ' + profileError.message);
        return { success: false };
      }

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { name, city }
      });

      if (authError) {
        console.error('Update auth metadata error:', authError);
      }

      console.log('Profile updated successfully');
      setUser({ ...user, name, city });
      if (userProfile) {
        setUserProfile({ ...userProfile, name, city });
      }
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

  const updateUserRole = async (userId: string, isAdmin: boolean) => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase || !user?.isAdmin) {
      Alert.alert('Fehler', 'Sie haben keine Berechtigung für diese Aktion.');
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('Updating user role:', userId, 'isAdmin:', isAdmin);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Update user role error:', error);
        Alert.alert('Fehler', 'Benutzerrolle konnte nicht aktualisiert werden: ' + error.message);
        return { success: false };
      }

      console.log('User role updated successfully');
      Alert.alert('Erfolg', `Benutzer wurde ${isAdmin ? 'zum Admin befördert' : 'vom Admin zurückgestuft'}.`);
      return { success: true };
    } catch (error) {
      console.error('Update user role error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string, banned: boolean) => {
    if (!isSupabaseInitialized()) {
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase || !user?.isAdmin) {
      Alert.alert('Fehler', 'Sie haben keine Berechtigung für diese Aktion.');
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('Updating user ban status:', userId, 'banned:', banned);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: banned, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Update user ban status error:', error);
        Alert.alert('Fehler', 'Benutzerstatus konnte nicht aktualisiert werden: ' + error.message);
        return { success: false };
      }

      console.log('User ban status updated successfully');
      Alert.alert('Erfolg', `Benutzer wurde ${banned ? 'gesperrt' : 'entsperrt'}.`);
      return { success: true };
    } catch (error) {
      console.error('Update user ban status error:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    updateProfile,
    updateUserRole,
    banUser,
    checkAuthStatus
  };
};
