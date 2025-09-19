
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import { colors } from '../styles/commonStyles';
import { Event } from '../types/Event';
import { getSupabase } from '../utils/supabase';

interface ShareEventSheetProps {
  isVisible: boolean;
  onClose: () => void;
  event: Event | null;
  senderName: string;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  eventInfo: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  emailInput: {
    minHeight: 48,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default function ShareEventSheet({ isVisible, onClose, event, senderName }: ShareEventSheetProps) {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setEmails('');
    onClose();
  };

  const validateEmails = (emailString: string): string[] => {
    const emailList = emailString
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emailList.filter(email => emailRegex.test(email));

    return validEmails;
  };

  const handleShare = async () => {
    if (!event) return;

    const validEmails = validateEmails(emails);
    
    if (validEmails.length === 0) {
      Alert.alert('Fehler', 'Bitte geben Sie mindestens eine gültige E-Mail-Adresse ein.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        Alert.alert('Fehler', 'Keine Verbindung zur Datenbank.');
        return;
      }

      // Call the edge function to send emails
      const { data, error } = await supabase.functions.invoke('share-event', {
        body: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          eventDescription: event.description,
          recipientEmails: validEmails,
          senderName: senderName,
        },
      });

      if (error) {
        console.error('Error sharing event:', error);
        Alert.alert('Fehler', 'Die Veranstaltung konnte nicht geteilt werden: ' + error.message);
        return;
      }

      console.log('Event shared successfully:', data);
      Alert.alert(
        'Erfolgreich geteilt!',
        `Die Veranstaltung wurde an ${validEmails.length} Empfänger gesendet.`,
        [
          {
            text: 'OK',
            onPress: handleClose
          }
        ]
      );

    } catch (error) {
      console.error('Error sharing event:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const validEmails = validateEmails(emails);

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Veranstaltung teilen</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="x" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDetails}>
            📅 {formatDate(event.date)} um {event.time}
            {'\n'}📍 {event.location}
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-Mail-Adressen</Text>
          <TextInput
            style={[styles.input, styles.emailInput]}
            value={emails}
            onChangeText={setEmails}
            placeholder="max@beispiel.de, anna@beispiel.de"
            placeholderTextColor={colors.grey}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />
          <Text style={styles.helpText}>
            Geben Sie E-Mail-Adressen getrennt durch Kommas, Semikolons oder Zeilenumbrüche ein.
            {validEmails.length > 0 && ` (${validEmails.length} gültige E-Mail${validEmails.length === 1 ? '' : 's'} erkannt)`}
          </Text>
        </View>

        {/* Preview */}
        {validEmails.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>E-Mail-Vorschau:</Text>
            <Text style={styles.previewText}>
              Betreff: Neue Veranstaltung: {event.title}
              {'\n\n'}
              Hallo,
              {'\n\n'}
              {senderName} möchte Sie über eine neue Veranstaltung informieren:
              {'\n\n'}
              📅 {event.title}
              {'\n'}
              🗓️ {formatDate(event.date)} um {event.time}
              {'\n'}
              📍 {event.location}
              {'\n\n'}
              📝 {event.description.substring(0, 100)}...
            </Text>
          </View>
        )}

        {/* Share Button */}
        <TouchableOpacity
          style={[styles.shareButton, (loading || validEmails.length === 0) && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={loading || validEmails.length === 0}
        >
          <Text style={styles.shareButtonText}>
            {loading ? 'Wird gesendet...' : `An ${validEmails.length} Empfänger senden`}
          </Text>
        </TouchableOpacity>
      </View>
    </SimpleBottomSheet>
  );
}
