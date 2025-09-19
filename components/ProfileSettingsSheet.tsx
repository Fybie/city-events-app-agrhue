
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

interface ProfileSettingsSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileSettingsSheet: React.FC<ProfileSettingsSheetProps> = ({ isVisible, onClose }) => {
  const { user, updateProfile, deleteAccount, signOut, loading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCity(user.city || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein.');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie eine Stadt ein.');
      return;
    }

    const result = await updateProfile(name, city);
    if (result.success) {
      onClose();
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      onClose();
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'default',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              onClose();
            }
          }
        }
      ]
    );
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil bearbeiten</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Persönliche Informationen</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{user?.email}</Text>
              </View>
              <Text style={styles.helperText}>E-Mail kann nicht geändert werden</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ihr vollständiger Name"
                placeholderTextColor={colors.grey}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Stadt</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Ihre Stadt"
                placeholderTextColor={colors.grey}
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.updateButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Wird gespeichert...' : 'Profil aktualisieren'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konto-Aktionen</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
              <Icon name="log-out-outline" size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>Abmelden</Text>
              <Icon name="chevron-forward" size={16} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <View style={styles.dangerSection}>
            <Text style={styles.dangerSectionTitle}>Gefahrenbereich</Text>
            
            <TouchableOpacity 
              style={styles.dangerButton} 
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Icon name="trash-outline" size={20} color={colors.error} />
              <Text style={styles.dangerButtonText}>Konto löschen</Text>
              <Icon name="chevron-forward" size={16} color={colors.error} />
            </TouchableOpacity>
            
            <Text style={styles.dangerHelperText}>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden dauerhaft gelöscht.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey + '40',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: colors.grey + '40',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.grey + '20',
  },
  disabledInputText: {
    fontSize: 16,
    color: colors.grey,
  },
  helperText: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  dangerSection: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '30',
  },
  dangerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.error + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error + '30',
    marginBottom: 8,
  },
  dangerButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 12,
  },
  dangerHelperText: {
    fontSize: 12,
    color: colors.grey,
    lineHeight: 16,
  },
});

export default ProfileSettingsSheet;
