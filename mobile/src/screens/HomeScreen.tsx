import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GAMES } from '../data/mockData';
import { RootStackParamList, Game } from '../types';
import { Colors, Radius, Spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/ui/SearchBar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AppText } from '../components/ui/AppText';
import { GameCard } from '../components/game/GameCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const COLUMN_GAP = Spacing.sm;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(listOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
        ...(isAdmin
          ? [Animated.spring(fabScale, { toValue: 1, delay: 700, useNativeDriver: true, speed: 5, bounciness: 12 })]
          : []),
      ]).start();
    }, 1400);
    return () => clearTimeout(timer);
  }, [headerOpacity, listOpacity, fabScale, isAdmin]);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GAMES;
    return GAMES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q)
    );
  }, [query]);

  const handleCardPress = useCallback(
    (index: number) => {
      navigation.navigate('GameDetail', { initialIndex: index });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Game; index: number }) => (
      <View style={index % 2 === 0 ? styles.cardLeft : styles.cardRight}>
        <GameCard game={item} onPress={() => handleCardPress(GAMES.indexOf(item))} />
      </View>
    ),
    [handleCardPress]
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <AppText variant="h3" color="tertiary" style={styles.emptyIcon}>
        🎮
      </AppText>
      <AppText variant="body" color="secondary" style={styles.emptyText}>
        Nenhum jogo encontrado para "{query}"
      </AppText>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Carregando biblioteca..." />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View style={styles.headerRow}>
            <View>
              <AppText variant="h1">Gamestar</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
                {GAMES.length} jogos disponíveis
              </AppText>
            </View>
            <View style={styles.headerActions}>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={Colors.accent} />
                  <AppText variant="caption" style={styles.adminBadgeText}>
                    ADMIN
                  </AppText>
                </View>
              )}
              <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
                <Ionicons name="log-out-outline" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            style={styles.searchBar}
          />
        </Animated.View>
      </SafeAreaView>

      <Animated.View style={[styles.listWrapper, { opacity: listOpacity }]}>
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={ListEmpty}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Animated.View>

      {/* Admin FAB — add new game */}
      {isAdmin && (
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fabButton}
            activeOpacity={0.85}
            onPress={() => {/* Navigate to add-game screen in production */}}
          >
            <Ionicons name="add" size={28} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(124,111,205,0.14)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(124,111,205,0.30)',
  },
  adminBadgeText: {
    color: Colors.accent,
    letterSpacing: 1,
  },
  logoutButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subtitle: {
    marginTop: 2,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  listWrapper: { flex: 1 },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl + 56,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardLeft: { flex: 1, marginRight: COLUMN_GAP / 2 },
  cardRight: { flex: 1, marginLeft: COLUMN_GAP / 2 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.md,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
