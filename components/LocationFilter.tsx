
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  availableLocations: string[];
}

export default function LocationFilter({ selectedLocation, onLocationChange, availableLocations }: LocationFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLocationSelect = (location: string) => {
    console.log('Ausgewählter Ort:', location);
    onLocationChange(location);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Icon name="location-outline" size={16} color={colors.text} />
        <Text style={styles.filterText}>
          {selectedLocation}
        </Text>
        <Icon name="chevron-down" size={16} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ort auswählen</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.locationList}>
              {availableLocations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.locationItem,
                    selectedLocation === location && styles.selectedLocationItem
                  ]}
                  onPress={() => handleLocationSelect(location)}
                >
                  <Text style={[
                    styles.locationText,
                    selectedLocation === location && styles.selectedLocationText
                  ]}>
                    {location}
                  </Text>
                  {selectedLocation === location && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  locationList: {
    maxHeight: 300,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  selectedLocationItem: {
    backgroundColor: colors.lightGrey,
  },
  locationText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  selectedLocationText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
