import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { Game } from '../../types';
import { GAME_COLORS } from '../../data/mockData';
import { Card } from '../ui/Card';
import { AppText } from '../ui/AppText';
import { StarRating } from '../ui/StarRating';

interface GameCardProps {
  game: Game;
  onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_GAP = Spacing.sm;
const HORIZONTAL_PADDING = Spacing.md * 2;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - COLUMN_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH * 1.45;

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => (
  <Card onPress={onPress} style={styles.card}>
    <View style={[styles.cover, { backgroundColor: GAME_COLORS[game.id] ?? Colors.surfaceMid }]} />
    <View style={styles.footer}>
      <AppText variant="bodySmall" numberOfLines={2} style={styles.title}>
        {game.title}
      </AppText>
      <View style={styles.meta}>
        <AppText variant="caption" color="tertiary">{game.genre}</AppText>
        <StarRating rating={game.rating} size={11} />
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, marginBottom: COLUMN_GAP },
  cover: { width: '100%', height: IMAGE_HEIGHT },
  footer: { padding: Spacing.sm, gap: 4 },
  title: { color: Colors.textPrimary, fontWeight: '600', lineHeight: 17 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
});
