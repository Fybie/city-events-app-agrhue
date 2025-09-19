
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

const ImpressumScreen = () => {
  return (
    <SafeAreaView style={[commonStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impressum</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Angaben gemäß § 5 TMG</Text>
          
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Herausgeber:</Text>
            <Text style={styles.value}>Stadt Pattensen</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Vertreten durch:</Text>
            <Text style={styles.value}>Die Bürgermeisterin</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Anschrift:</Text>
            <Text style={styles.value}>Rathausplatz 1</Text>
            <Text style={styles.value}>30982 Pattensen</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Postanschrift:</Text>
            <Text style={styles.value}>Stadt Pattensen</Text>
            <Text style={styles.value}>Rathausplatz 1</Text>
            <Text style={styles.value}>30982 Pattensen</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechtliche Hinweise</Text>
          
          <Text style={styles.disclaimer}>
            Die Stadt Pattensen übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen. Haftungsansprüche gegen die Stadt Pattensen, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datenschutz</Text>
          
          <Text style={styles.disclaimer}>
            Die Nutzung unserer App ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stand: {new Date().toLocaleDateString('de-DE')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoBlock: {
    marginBottom: 16,
  },
  label: {
    color: colors.grey,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimer: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '30',
  },
  footerText: {
    color: colors.grey,
    fontSize: 12,
  },
});

export default ImpressumScreen;
