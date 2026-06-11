import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { AppText } from './AppText';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  style?: ViewStyle;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const getStarIcon = (starPosition: number, rating: number): IoniconsName => {
  if (rating >= starPosition) return 'star';
  if (rating >= starPosition - 0.5) return 'star-half';
  return 'star-outline';
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  onRate,
  showValue = false,
  style,
}) => {
  const interactive = !!onRate;

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxStars }, (_, i) => {
        const position = i + 1;
        const filled = interactive ? rating >= position : undefined;
        const iconName: IoniconsName = interactive
          ? (filled ? 'star' : 'star-outline')
          : getStarIcon(position, rating);
        const color = (interactive ? rating >= position : rating >= position - 0.4)
          ? Colors.star
          : Colors.starEmpty;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => onRate?.(position)}
            disabled={!interactive}
            activeOpacity={interactive ? 0.6 : 1}
            style={styles.star}
          >
            <Ionicons name={iconName} size={size} color={color} />
          </TouchableOpacity>
        );
      })}
      {showValue && (
        <AppText variant="bodySmall" color="secondary" style={styles.value}>
          {rating.toFixed(1)}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  value: {
    marginLeft: Spacing.xs,
  },
});
