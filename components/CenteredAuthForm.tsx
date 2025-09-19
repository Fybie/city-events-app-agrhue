
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CenteredAuthFormProps {
  onAuthSuccess?: () => void;
}

const CenteredAuthForm: React.FC<CenteredAuthFormProps> = ({ onAuthSuccess }) => {
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
      if (result.success && onAuthSuccess) {
        onAuthSuccess();
      }
    } else {
      const result = await signUp(email, password, name, city);
      if (result.success) {
        Alert.alert(
          'Registrierung erfolgreich!',
          'Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren.',
          [
            {
              text: 'OK',
              onPress: () => {
                setMode('login');
                resetForm();
              }
            }
          ]
        );
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="calendar" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Städtischer Veranstaltungskalender</Text>
            <Text style={styles.subtitle}>
              {mode === 'login' 
                ? 'Melden Sie sich an, um Veranstaltungen zu verwalten' 
                : 'Erstellen Sie Ihr Konto für den Veranstaltungskalender'
              }
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail-Adresse</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ihre.email@beispiel.de"
                placeholderTextColor={colors.grey}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
            </View>

            {mode === 'register' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Vollständiger Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Max Mustermann"
                    placeholderTextColor={colors.grey}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Stadt</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Berlin"
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
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
                  autoComplete="new-password"
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: screenHeight - 100,
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    boxShadow: '0px 12px 48px rgba(0, 0, 0, 0.15)',
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 14,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CenteredAuthForm;
