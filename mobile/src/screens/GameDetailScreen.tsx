import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GAMES, GAME_COLORS } from '../data/mockData';
import { Review, RootStackParamList } from '../types';
import { Colors, Radius, Spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { AppText } from '../components/ui/AppText';
import { Button } from '../components/ui/Button';
import { StarRating } from '../components/ui/StarRating';
import { ErrorModal } from '../components/ui/ErrorModal';
import { ReviewItem } from '../components/game/ReviewItem';

type Props = NativeStackScreenProps<RootStackParamList, 'GameDetail'>;
type Tab = 'comments' | 'rate';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_HEIGHT = SCREEN_WIDTH * 1.1;

export const GameDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { isAdmin, user } = useAuth();
  const insets = useSafeAreaInsets();
  const { initialIndex } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState<Tab>('comments');
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [reviews, setReviews] = useState<Review[]>(() => GAMES[initialIndex].reviews);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const game = GAMES[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < GAMES.length - 1;

  const navigateTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0 || newIndex >= GAMES.length) return;

      setIsAnimating(true);
      const slideOut = direction === 'next' ? -50 : 50;
      const slideIn = direction === 'next' ? 50 : -50;

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: slideOut, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        setCurrentIndex(newIndex);
        setReviews(GAMES[newIndex].reviews);
        setUserRating(0);
        setReviewText('');
        setActiveTab('comments');
        slideAnim.setValue(slideIn);
        scrollRef.current?.scrollTo({ y: 0, animated: false });

        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 230, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 230, useNativeDriver: true }),
        ]).start(() => setIsAnimating(false));
      });
    },
    [currentIndex, isAnimating, fadeAnim, slideAnim]
  );

  const showError = (msg: string) => { setModalMessage(msg); setModalVisible(true); };

  const handleSubmitReview = () => {
    if (userRating === 0) { showError('Selecione uma nota de 1 a 5 estrelas antes de enviar sua avaliação.'); return; }
    if (reviewText.trim().length < 10) { showError('Sua avaliação deve ter pelo menos 10 caracteres.'); return; }
    const today = new Date().toISOString().split('T')[0];
    const newReview: Review = {
      id: `local-${Date.now()}`,
      userId: user?.id ?? 'anon',
      author: user?.username ?? 'Anônimo',
      rating: userRating,
      body: reviewText.trim(),
      date: today,
    };
    setReviews(prev => [newReview, ...prev]);
    setUserRating(0);
    setReviewText('');
    setActiveTab('comments');
  };

  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : game.rating;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.headerSafe, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <AppText variant="label" color="secondary" numberOfLines={1} style={styles.headerTitle}>GAMESTAR</AppText>
          {isAdmin ? (
            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.adminIconButton} activeOpacity={0.7}>
                <Ionicons name="create-outline" size={18} color={Colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminIconButton, styles.deleteButton]}
                activeOpacity={0.7}
                onPress={() => showError('Funcionalidade disponível com API conectada.')}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Cover placeholder */}
          <View style={styles.coverWrapper}>
            <View style={[styles.cover, { backgroundColor: GAME_COLORS[game.id] ?? Colors.surfaceMid }]} />
            <View style={styles.coverGradient} />
            <View style={styles.coverMeta}>
              <AppText variant="label" color="secondary" style={styles.genre}>
                {game.genre ? `${game.genre.toUpperCase()} · ` : ''}{game.year || ''}
              </AppText>
              <AppText variant="h2" style={styles.coverTitle}>{game.title}</AppText>
              <AppText variant="bodySmall" color="secondary">{game.developer}</AppText>
            </View>
          </View>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <StarRating rating={avgRating} size={22} showValue />
            <View style={styles.reviewCount}>
              <AppText variant="caption" color="tertiary">{reviews.length} avaliações</AppText>
            </View>
          </View>

          {/* Description */}
          {game.description ? (
            <View style={styles.section}>
              <AppText variant="body" color="secondary">{game.description}</AppText>
            </View>
          ) : null}

          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={() => setActiveTab('comments')}
              style={[styles.tabItem, activeTab === 'comments' && styles.tabItemActive]}
              activeOpacity={0.7}
            >
              <AppText variant="label" color={activeTab === 'comments' ? 'accent' : 'secondary'}>COMENTÁRIOS</AppText>
            </TouchableOpacity>
            {!isAdmin && (
              <TouchableOpacity
                onPress={() => setActiveTab('rate')}
                style={[styles.tabItem, activeTab === 'rate' && styles.tabItemActive]}
                activeOpacity={0.7}
              >
                <AppText variant="label" color={activeTab === 'rate' ? 'accent' : 'secondary'}>AVALIAR</AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {activeTab === 'comments' ? (
              <View>
                {reviews.length === 0 ? (
                  <AppText variant="body" color="tertiary" style={styles.emptyReviews}>
                    Nenhuma avaliação ainda. Seja o primeiro!
                  </AppText>
                ) : (
                  reviews.map((review) => <ReviewItem key={review.id} review={review} />)
                )}
              </View>
            ) : (
              <View style={styles.rateForm}>
                <AppText variant="bodySmall" color="secondary" style={styles.rateLabel}>Sua nota</AppText>
                <StarRating rating={userRating} size={36} onRate={setUserRating} style={styles.rateStars} />
                <AppText variant="bodySmall" color="secondary" style={styles.rateLabel}>Seu comentário</AppText>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Escreva sua avaliação aqui..."
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  numberOfLines={5}
                  style={styles.textInput}
                  selectionColor={Colors.accent}
                  textAlignVertical="top"
                />
                <Button label="Publicar Avaliação" onPress={handleSubmitReview} fullWidth style={styles.submitButton} />
              </View>
            )}
          </View>

          <View style={{ height: 96 }} />
        </ScrollView>
      </Animated.View>

      {/* Bottom nav */}
      <View style={[styles.navSafe, { paddingBottom: insets.bottom || Spacing.sm }]}>
        <View style={styles.navBar}>
          <Button
            variant="secondary"
            icon={<Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />}
            label="Anterior"
            onPress={() => navigateTo('prev')}
            disabled={!hasPrev || isAnimating}
          />
          <AppText variant="caption" color="tertiary">{currentIndex + 1} / {GAMES.length}</AppText>
          <Button
            variant="secondary"
            icon={<Ionicons name="chevron-forward" size={18} color={Colors.textPrimary} />}
            label="Próximo"
            onPress={() => navigateTo('next')}
            disabled={!hasNext || isAnimating}
          />
        </View>
      </View>

      <ErrorModal visible={modalVisible} message={modalMessage} onDismiss={() => setModalVisible(false)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: Colors.background, zIndex: 10 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceMid, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', letterSpacing: 2 },
  headerSpacer: { width: 44 },
  adminActions: { flexDirection: 'row', gap: Spacing.xs },
  adminIconButton: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceMid, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  deleteButton: { borderColor: 'rgba(224,82,82,0.30)', backgroundColor: 'rgba(224,82,82,0.08)' },
  contentWrapper: { flex: 1, overflow: 'hidden' },
  coverWrapper: { width: '100%', height: COVER_HEIGHT, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  coverGradient: { ...StyleSheet.absoluteFillObject, top: '40%', backgroundColor: 'rgba(13,13,16,0.92)' },
  coverMeta: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, gap: 4 },
  genre: { letterSpacing: 1.5, marginBottom: 2 },
  coverTitle: { color: Colors.white },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  reviewCount: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  section: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  tabBar: { flexDirection: 'row', marginHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabItem: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: Colors.accent },
  tabContent: { padding: Spacing.md },
  emptyReviews: { textAlign: 'center', paddingVertical: Spacing.xl },
  rateForm: { gap: Spacing.sm },
  rateLabel: { marginBottom: 2 },
  rateStars: { paddingVertical: Spacing.sm },
  textInput: {
    backgroundColor: Colors.surfaceMid, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary,
    fontSize: 15, padding: Spacing.md, minHeight: 120,
  },
  submitButton: { marginTop: Spacing.sm },
  navSafe: { backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
});
