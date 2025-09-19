
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { colors } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import { currentUser } from '../data/mockData';
import * as ImagePicker from 'expo-image-picker';

interface CreatePastEventReportSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateReport: (report: {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    city: string;
    author: string;
    authorId: string;
    images?: string[];
  }) => void;
}

const CreatePastEventReportSheet: React.FC<CreatePastEventReportSheetProps> = ({
  isVisible,
  onClose,
  onCreateReport
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const pickImages = async () => {
    console.log('Öffne Bildauswahl für mehrere Bilder');
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Berechtigung erforderlich', 'Bitte erlauben Sie den Zugriff auf Ihre Fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Bild ausgewählt:', result.assets[0].uri);
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    console.log('Entferne Bild bei Index:', index);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !eventDate.trim() || !location.trim() || !city.trim()) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    console.log('Erstelle neuen Event-Bericht:', title);
    
    onCreateReport({
      title: title.trim(),
      description: description.trim(),
      eventDate: eventDate.trim(),
      location: location.trim(),
      city: city.trim(),
      author: currentUser.name,
      authorId: currentUser.id,
      images: selectedImages.length > 0 ? selectedImages : undefined
    });

    // Formular zurücksetzen
    setTitle('');
    setDescription('');
    setEventDate('');
    setLocation('');
    setCity('');
    setSelectedImages([]);
    
    onClose();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Event-Bericht erstellen</Text>
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
              placeholder="Wie war das Event?"
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Beschreibung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Erzählen Sie von Ihren Erfahrungen..."
              placeholderTextColor={colors.grey}
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bilder</Text>
            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.selectedImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => removeImage(index)}
                    >
                      <Icon name="close" size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
              <Icon name="camera-outline" size={24} color={colors.text} />
              <Text style={styles.imagePickerText}>
                {selectedImages.length > 0 ? 'Weiteres Bild hinzufügen' : 'Bilder hinzufügen'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event-Datum</Text>
            <TextInput
              style={styles.input}
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ort</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Wo fand das Event statt?"
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
            <Text style={styles.submitButtonText}>Bericht erstellen</Text>
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
    height: 120,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  selectedImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imagePickerText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
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

export default CreatePastEventReportSheet;
