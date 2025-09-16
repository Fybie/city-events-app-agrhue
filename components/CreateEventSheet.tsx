
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import { currentUser } from '../data/mockData';

interface CreateEventSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateEvent: (event: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    author: string;
    authorId: string;
  }) => void;
}

const CreateEventSheet: React.FC<CreateEventSheetProps> = ({
  isVisible,
  onClose,
  onCreateEvent
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !date.trim() || !time.trim() || !location.trim() || !city.trim()) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    console.log('Creating new event:', title);
    
    onCreateEvent({
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      city: city.trim(),
      author: currentUser.name,
      authorId: currentUser.id
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setCity('');
    
    onClose();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Neues Event erstellen</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titel</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Event-Titel eingeben..."
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Beschreibung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Beschreibung des Events..."
              placeholderTextColor={colors.grey}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Datum</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.grey}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Uhrzeit</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor={colors.grey}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ort</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Veranstaltungsort..."
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stadt</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Stadt..."
              placeholderTextColor={colors.grey}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Event erstellen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateEventSheet;
