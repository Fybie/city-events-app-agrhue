
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../types/Event';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onLike: () => void;
  showActions?: boolean;
  onReport?: () => void;
  onDelete?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onPress, 
  onLike, 
  showActions = true,
  onReport,
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(event.date)}</Text>
          <Text style={styles.time}>{event.time}</Text>
        </View>
        {event.isReported && (
          <View style={styles.reportedBadge}>
            <Text style={styles.reportedText}>Gemeldet</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={styles.locationContainer}>
        <Icon name="location-outline" size={16} color={colors.grey} />
        <Text style={styles.location}>{event.location}, {event.city}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.author}>von {event.author}</Text>
        
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onLike}>
              <Icon name="heart-outline" size={20} color={colors.accent} />
              <Text style={styles.actionText}>{event.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="chatbubble-outline" size={20} color={colors.accent} />
              <Text style={styles.actionText}>{event.comments.length}</Text>
            </TouchableOpacity>

            {onReport && (
              <TouchableOpacity style={styles.actionButton} onPress={onReport}>
                <Icon name="flag-outline" size={20} color={colors.grey} />
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Icon name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  date: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    color: colors.text,
    fontSize: 12,
    opacity: 0.8,
  },
  reportedBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    color: colors.grey,
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    color: colors.grey,
    fontSize: 12,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
    marginLeft: 4,
  },
});

export default EventCard;
