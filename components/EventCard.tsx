
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onLike: () => void;
  showActions?: boolean;
  onDelete?: () => void;
  onShare?: () => void;
  isAdmin?: boolean;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 200,
    backgroundColor: colors.backgroundAlt,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  author: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  likeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  likedButton: {
    backgroundColor: colors.primary + '20',
  },
  likedText: {
    color: colors.primary,
  },
});

export default function EventCard({ 
  event, 
  onPress, 
  onLike, 
  showActions = false, 
  onDelete,
  onShare,
  isAdmin = false
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const isUpcoming = () => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        'Veranstaltung löschen',
        'Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Löschen', style: 'destructive', onPress: onDelete }
        ]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="calendar" size={48} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.dateOverlay}>
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          {showActions && (
            <View style={styles.actionsContainer}>
              {isAdmin && onShare && (
                <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                  <Icon name="share" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <Icon name="trash-2" size={16} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatFullDate(event.date)} um {event.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{event.location}, {event.city}</Text>
          </View>
        </View>

        {event.description && (
          <Text style={styles.description} numberOfLines={3}>
            {event.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.author}>
            von {event.author} • {isUpcoming() ? 'Kommend' : 'Vergangen'}
          </Text>
          <TouchableOpacity
            style={[styles.likeButton, event.likes > 0 && styles.likedButton]}
            onPress={onLike}
          >
            <Icon
              name="heart"
              size={14}
              color={event.likes > 0 ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.likeText, event.likes > 0 && styles.likedText]}>
              {event.likes || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
