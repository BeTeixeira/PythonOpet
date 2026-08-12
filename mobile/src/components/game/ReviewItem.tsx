import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';
import { Review } from '../../types';
import { AppText } from '../ui/AppText';
import { StarRating } from '../ui/StarRating';

interface ReviewItemProps {
  review: Review;
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, isOwner, onDelete, onEdit }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.avatar}>
        <AppText variant="label" color="accent">
          {getInitials(review.author)}
        </AppText>
      </View>
      <View style={styles.authorMeta}>
        <AppText variant="bodySmall" style={styles.authorName}>
          {review.author}
        </AppText>
        <AppText variant="caption" color="tertiary">
          {formatDate(review.date)}
        </AppText>
      </View>
      <StarRating rating={review.rating} size={13} />
      {isOwner && (
        <View style={styles.ownerActions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={16} color={Colors.accent} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
    <AppText variant="bodySmall" color="secondary" style={styles.body}>
      {review.body}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderHigh,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  ownerActions: {
    flexDirection: 'row',
    marginLeft: Spacing.sm,
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  body: {
    lineHeight: 20,
  },
});
