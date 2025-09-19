
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { colors } from '../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default function ImpressumScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impressum</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Impressum</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Angaben gemäß § 5 TMG</Text>
          <Text style={styles.text}>
            Städtischer Veranstaltungskalender{'\n'}
            Musterstraße 123{'\n'}
            12345 Musterstadt{'\n'}
            Deutschland
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          <Text style={styles.text}>
            Telefon: +49 (0) 123 456789{'\n'}
            E-Mail: info@veranstaltungskalender.de
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</Text>
          <Text style={styles.text}>
            Max Mustermann{'\n'}
            Musterstraße 123{'\n'}
            12345 Musterstadt
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haftungsausschluss</Text>
          <Text style={styles.text}>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datenschutz</Text>
          <Text style={styles.text}>
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. 
            Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf 
            freiwilliger Basis.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technische Umsetzung</Text>
          <Text style={styles.text}>
            Diese App wurde mit React Native und Expo entwickelt und nutzt Supabase als Backend-Service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
