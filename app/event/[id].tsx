
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useEvents } from '../../hooks/useEvents';
import { currentUser } from '../../data/mockData';
import Icon from '../../components/Icon';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, likeEvent, addComment, reportEvent } = useEvents();
  const [commentText, setCommentText] = useState('');
  
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.grey} />
          <Text style={styles.errorText}>Event nicht gefunden</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Kommentar ein.');
      return;
    }

    console.log('Adding comment to event:', event.id);
    addComment(event.id, commentText.trim());
    setCommentText('');
  };

  const handleReport = () => {
    Alert.alert(
      'Event melden',
      'Möchten Sie dieses Event wirklich melden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Melden', 
          style: 'destructive',
          onPress: () => {
            console.log('Reporting event:', event.id);
            reportEvent(event.id);
            Alert.alert('Gemeldet', 'Das Event wurde gemeldet und wird überprüft.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={handleReport}>
          <Icon name="flag-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventContainer}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{formatDate(event.date)}</Text>
              <Text style={styles.time}>{event.time} Uhr</Text>
            </View>
            {event.isReported && (
              <View style={styles.reportedBadge}>
                <Text style={styles.reportedText}>Gemeldet</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.locationContainer}>
            <Icon name="location" size={20} color={colors.accent} />
            <Text style={styles.location}>{event.location}, {event.city}</Text>
          </View>

          <View style={styles.authorContainer}>
            <Icon name="person" size={16} color={colors.grey} />
            <Text style={styles.author}>Erstellt von {event.author}</Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => likeEvent(event.id)}
            >
              <Icon name="heart-outline" size={24} color={colors.accent} />
              <Text style={styles.actionText}>{event.likes} Likes</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButton}>
              <Icon name="chatbubble-outline" size={24} color={colors.accent} />
              <Text style={styles.actionText}>{event.comments.length} Kommentare</Text>
            </View>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Kommentare</Text>
          
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Kommentar schreiben..."
              placeholderTextColor={colors.grey}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleAddComment}
            >
              <Icon name="send" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {event.comments.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>Noch keine Kommentare</Text>
              <Text style={styles.noCommentsSubtext}>Sei der erste, der kommentiert!</Text>
            </View>
          ) : (
            event.comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  eventContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  date: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.8,
  },
  reportedBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reportedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  author: {
    color: colors.grey,
    fontSize: 14,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  commentsSection: {
    padding: 20,
  },
  commentsTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  noCommentsSubtext: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 4,
  },
  commentItem: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    color: colors.grey,
    fontSize: 12,
  },
  commentText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
