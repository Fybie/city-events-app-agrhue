
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/Icon';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors } from '../../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
  },
  eventContent: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  eventDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  authorMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  commentsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  commentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  loginPrompt: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginPromptText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function EventDetailScreen() {
  const { events, addComment, likeEvent, deleteEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState('');

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar-x" size={64} color={colors.textSecondary} />
          <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 16 }}>
            Veranstaltung nicht gefunden
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCommentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Anmeldung erforderlich', 'Sie müssen angemeldet sein, um Kommentare zu schreiben.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Kommentar ein.');
      return;
    }

    const result = await addComment(event.id, comment.trim(), user.name || 'Unbekannt', user.id);
    if (result.success) {
      setComment('');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Anmeldung erforderlich', 'Sie müssen angemeldet sein, um Veranstaltungen zu liken.');
      return;
    }

    await likeEvent(event.id, user.id);
  };

  const handleDelete = async () => {
    Alert.alert(
      'Veranstaltung löschen',
      'Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteEvent(event.id);
            if (result.success) {
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleReport = () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Anmeldung erforderlich', 'Sie müssen angemeldet sein, um Inhalte zu melden.');
      return;
    }

    Alert.alert(
      'Veranstaltung melden',
      'Möchten Sie diese Veranstaltung wegen unangemessener Inhalte melden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Melden',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Gemeldet', 'Die Veranstaltung wurde zur Überprüfung gemeldet.');
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canEdit = isAuthenticated && user && (user.id === event.authorId || user.isAdmin);
  const canDelete = isAuthenticated && user && (user.id === event.authorId || user.isAdmin);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleLike}>
            <Icon name="heart" size={20} color={colors.primary} />
          </TouchableOpacity>
          {canDelete && (
            <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
              <Icon name="trash-2" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton} onPress={handleReport}>
            <Icon name="flag" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        {event.image && (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        )}

        <View style={styles.eventContent}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>{event.title}</Text>

          {/* Event Meta */}
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Icon name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Icon name="map-pin" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{event.location}, {event.city}</Text>
            </View>
          </View>

          {/* Event Description */}
          <Text style={styles.eventDescription}>{event.description}</Text>

          {/* Event Stats */}
          <View style={styles.eventStats}>
            <View style={styles.statItem}>
              <Icon name="heart" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{event.likes} Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="message-circle" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{event.comments.length} Kommentare</Text>
            </View>
          </View>

          {/* Author Info */}
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {getInitials(event.author)}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{event.author}</Text>
              <Text style={styles.authorMeta}>
                Erstellt am {formatCommentDate(event.createdAt)}
              </Text>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Kommentare ({event.comments.length})</Text>

            {/* Comment Input */}
            {isAuthenticated && user ? (
              <>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Schreiben Sie einen Kommentar..."
                  placeholderTextColor={colors.textSecondary}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                />
                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={handleAddComment}
                  disabled={!comment.trim()}
                >
                  <Text style={styles.commentButtonText}>Kommentieren</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Melden Sie sich an, um Kommentare zu schreiben
                </Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/(tabs)/')}
                >
                  <Text style={styles.loginButtonText}>Anmelden</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Comments List */}
            {event.comments.length === 0 ? (
              <View style={styles.emptyComments}>
                <Icon name="message-circle" size={32} color={colors.textSecondary} />
                <Text style={styles.emptyCommentsText}>
                  Noch keine Kommentare vorhanden.{'\n'}
                  Seien Sie der Erste, der kommentiert!
                </Text>
              </View>
            ) : (
              event.comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentDate}>
                      {formatCommentDate(comment.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
