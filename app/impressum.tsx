
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
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
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
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 16,
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  versionInfo: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  versionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default function ImpressumScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App-Information</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>
            Städtischer Veranstaltungskalender v1.0.0
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Über diese App</Text>
          <Text style={styles.text}>
            Der städtische Veranstaltungskalender ist eine moderne Web-App, die es Bürgern ermöglicht, 
            lokale Veranstaltungen zu entdecken, zu erstellen und zu verwalten. Die App wurde speziell 
            für die Bedürfnisse von Städten und Gemeinden entwickelt.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hauptfunktionen</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🔐 Benutzer-Authentifizierung</Text>
            <Text style={styles.featureText}>
              Sichere Registrierung und Anmeldung mit E-Mail und Passwort. 
              Automatische Profilerstellung mit E-Mail-Verifizierung.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>👥 Admin-Rollen</Text>
            <Text style={styles.featureText}>
              Administratoren können Veranstaltungen verwalten, Benutzer befördern/sperren 
              und haben Zugriff auf erweiterte Funktionen.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📅 Event-Management</Text>
            <Text style={styles.featureText}>
              Vollständige Verwaltung von Veranstaltungen mit Titel, Datum, Uhrzeit, 
              Ort und Beschreibung. Kalender- und Listenansicht verfügbar.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📱 Responsives Design</Text>
            <Text style={styles.featureText}>
              Optimiert für Handy, Tablet und Desktop. Tastatur-freundlich 
              und WebView-kompatibel.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📧 Event-Sharing</Text>
            <Text style={styles.featureText}>
              Administratoren können Veranstaltungen per E-Mail teilen und 
              Einladungen an mehrere Empfänger senden.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🔒 Sicherheit</Text>
            <Text style={styles.featureText}>
              Row-Level Security (RLS) in der Datenbank, rollenbasierte Zugriffskontrolle 
              und sichere Authentifizierung.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technische Details</Text>
          <Text style={styles.bulletPoint}>• React Native + Expo 54</Text>
          <Text style={styles.bulletPoint}>• Supabase für Datenbank und Authentifizierung</Text>
          <Text style={styles.bulletPoint}>• TypeScript für Typsicherheit</Text>
          <Text style={styles.bulletPoint}>• Edge Functions für E-Mail-Versand</Text>
          <Text style={styles.bulletPoint}>• Responsive Design für alle Geräte</Text>
          <Text style={styles.bulletPoint}>• Offline-Modus mit Fallback-Daten</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benutzerrollen</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: '600' }}>Normale Benutzer:</Text> Können Veranstaltungen ansehen, 
            erstellen, kommentieren und liken. Haben Zugriff auf ihr Profil und können 
            Veranstaltungen vorschlagen.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: '600' }}>Administratoren:</Text> Haben alle Rechte normaler Benutzer 
            plus die Möglichkeit, alle Veranstaltungen zu bearbeiten/löschen, Benutzer zu verwalten, 
            Events per E-Mail zu teilen und Systemeinstellungen zu ändern.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datenschutz & Sicherheit</Text>
          <Text style={styles.text}>
            Alle Benutzerdaten werden sicher in der Supabase-Datenbank gespeichert. 
            Die App implementiert Row-Level Security (RLS) für maximale Datensicherheit. 
            Benutzer können ihre Daten jederzeit einsehen, bearbeiten oder löschen.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deployment</Text>
          <Text style={styles.text}>
            Die App ist vollständig deploybar und kann auf verschiedenen Plattformen 
            gehostet werden:
          </Text>
          <Text style={styles.bulletPoint}>• EAS Hosting (Expo Application Services)</Text>
          <Text style={styles.bulletPoint}>• Supabase Storage</Text>
          <Text style={styles.bulletPoint}>• Vercel, Netlify oder ähnliche Plattformen</Text>
          <Text style={styles.bulletPoint}>• WebView-kompatibel (z.B. Natively, Expo Go)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Wartung</Text>
          <Text style={styles.text}>
            Die App wurde mit modernen Best Practices entwickelt und ist wartungsfreundlich. 
            Alle Komponenten sind modular aufgebaut und gut dokumentiert. 
            Updates können einfach über das Supabase-Dashboard verwaltet werden.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entwickelt mit ❤️</Text>
          <Text style={styles.text}>
            Diese App wurde speziell für städtische Veranstaltungskalender entwickelt 
            und erfüllt alle modernen Anforderungen an Benutzerfreundlichkeit, 
            Sicherheit und Skalierbarkeit.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
