
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

interface AuthSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const AuthSheet: React.FC<AuthSheetProps> = ({ isVisible, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, loading } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setCity('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie eine E-Mail-Adresse ein.');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie ein Passwort ein.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.');
      return false;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        Alert.alert('Fehler', 'Bitte geben Sie Ihren Namen ein.');
        return false;
      }

      if (!city.trim()) {
        Alert.alert('Fehler', 'Bitte geben Sie Ihre Stadt ein.');
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log(`Attempting ${mode} for:`, email);

    if (mode === 'login') {
      const result = await signIn(email, password);
      if (result.success) {
        handleClose();
      }
    } else {
      const result = await signUp(email, password, name, city);
      if (result.success) {
        handleClose();
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-Mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ihre.email@beispiel.de"
              placeholderTextColor={colors.grey}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {mode === 'register' && (
            <>
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
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Passwort</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Mindestens 6 Zeichen"
                placeholderTextColor={colors.grey}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.grey}
                />
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'register' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Passwort bestätigen</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Passwort wiederholen"
                placeholderTextColor={colors.grey}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Wird verarbeitet...' : (mode === 'login' ? 'Anmelden' : 'Registrieren')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
            <Text style={styles.switchButtonText}>
              {mode === 'login' 
                ? 'Noch kein Konto? Jetzt registrieren' 
                : 'Bereits ein Konto? Jetzt anmelden'
              }
            </Text>
          </TouchableOpacity>
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
  form: {
    padding: 20,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey + '40',
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  switchButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthSheet;
