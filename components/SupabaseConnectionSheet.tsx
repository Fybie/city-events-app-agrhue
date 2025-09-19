
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { initializeSupabase } from '../utils/supabase';

interface SupabaseConnectionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConnected: () => void;
}

const SupabaseConnectionSheet: React.FC<SupabaseConnectionSheetProps> = ({ 
  isVisible, 
  onClose, 
  onConnected 
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUrl('');
    setAnonKey('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!url.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie die Supabase URL ein.');
      return false;
    }

    if (!url.includes('supabase.co')) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige Supabase URL ein.');
      return false;
    }

    if (!anonKey.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie den Anon Key ein.');
      return false;
    }

    return true;
  };

  const handleConnect = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Connecting to Supabase:', url);
      const supabase = initializeSupabase(url.trim(), anonKey.trim());
      
      // Test the connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error && error.message.includes('Invalid API key')) {
        Alert.alert('Verbindung fehlgeschlagen', 'Ungültiger API-Schlüssel. Bitte überprüfen Sie Ihre Eingaben.');
        return;
      }

      console.log('Supabase connection successful');
      Alert.alert('Erfolgreich verbunden', 'Supabase wurde erfolgreich verbunden!');
      onConnected();
      handleClose();
    } catch (error) {
      console.error('Supabase connection error:', error);
      Alert.alert('Verbindung fehlgeschlagen', 'Fehler beim Verbinden mit Supabase. Bitte überprüfen Sie Ihre Eingaben.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Supabase verbinden</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Icon name="information-circle-outline" size={24} color={colors.accent} />
            <Text style={styles.infoText}>
              Um die Authentifizierung und Datenspeicherung zu nutzen, verbinden Sie sich mit Ihrem Supabase-Projekt.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Supabase URL</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="https://ihr-projekt.supabase.co"
                placeholderTextColor={colors.grey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                Finden Sie diese in Ihrem Supabase Dashboard unter Settings → API
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Anon Key</Text>
              <TextInput
                style={styles.input}
                value={anonKey}
                onChangeText={setAnonKey}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                placeholderTextColor={colors.grey}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                numberOfLines={3}
              />
              <Text style={styles.helperText}>
                Der öffentliche Anon-Schlüssel aus Ihrem Supabase Dashboard
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.connectButton, loading && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={loading}
            >
              <Text style={styles.connectButtonText}>
                {loading ? 'Verbinde...' : 'Verbinden'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>So finden Sie Ihre Supabase-Daten:</Text>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>Gehen Sie zu supabase.com und melden Sie sich an</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>Wählen Sie Ihr Projekt aus oder erstellen Sie ein neues</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>Gehen Sie zu Settings → API</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>Kopieren Sie die URL und den anon/public Key</Text>
            </View>
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
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accent + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
    lineHeight: 16,
  },
  connectButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsSection: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    width: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default SupabaseConnectionSheet;
