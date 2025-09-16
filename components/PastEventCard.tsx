
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { PastEventReport } from '../types/Event';
import Icon from './Icon';

interface PastEventCardProps {
  report: PastEventReport;
  onPress: () => void;
  onLike: () => void;
  showActions?: boolean;
  onReport?: () => void;
  onDelete?: () => void;
}

const PastEventCard: React.FC<PastEventCardProps> = ({
  report,
  onPress,
  onLike,
  showActions = true,
  onReport,
  onDelete
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `vor ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `vor ${diffInDays}d`;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {report.title}
            </Text>
            <Text style={styles.author}>von {report.author} • {formatTimeAgo(report.createdAt)}</Text>
          </View>
          {report.isReported && (
            <View style={styles.reportedBadge}>
              <Icon name="warning" size={16} color={colors.error} />
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={4}>
          {report.description}
        </Text>

        {report.images && report.images.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {report.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.reportImage} />
            ))}
          </ScrollView>
        )}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={16} color={colors.text} />
            <Text style={styles.detailText}>
              Event: {formatDate(report.eventDate)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={16} color={colors.text} />
            <Text style={styles.detailText}>
              {report.location}, {report.city}
            </Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onLike}>
              <Icon name="heart-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>{report.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="chatbubble-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>{report.comments.length}</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              {onReport && (
                <TouchableOpacity style={styles.actionButton} onPress={onReport}>
                  <Icon name="flag-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
              
              {onDelete && (
                <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                  <Icon name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
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
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  author: {
    color: colors.grey,
    fontSize: 14,
  },
  reportedBadge: {
    backgroundColor: colors.error + '20',
    borderRadius: 12,
    padding: 4,
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  reportImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '30',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
});

export default PastEventCard;
