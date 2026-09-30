import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Game } from "../data/games";
import { useAppTheme } from "../theme/ThemeContext";
import StarRating from "./StarRating";

type Props = {
  game: Game;
  // "catalog"  -> mostra o gênero e a nota geral (tela inicial)
  // "library"  -> mostra o seu comentário e a sua nota (tela "Minha lista")
  variant: "catalog" | "library";
  onPress: () => void;
};

export default function GameCard({ game, variant, onPress }: Props) {
  const { colors } = useAppTheme();
  const subtitle = variant === "catalog" ? game.genre : game.myComment;
  const rating = variant === "catalog" ? game.ratingGeral : game.myRating;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      {game.image ? (
        <Image source={game.image} style={styles.thumb} />
      ) : (
        // Placeholder exibido quando o jogo não tem imagem definida em games.ts
        <View style={[styles.thumb, styles.thumbPlaceholder, { borderColor: colors.cardBorder }]}>
          <Ionicons name="image-outline" size={18} color={colors.textSecondary} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
        <StarRating rating={rating} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  thumb: { width: 42, height: 42, borderRadius: 8 },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
  title: { fontSize: 13, fontWeight: "600" },
  subtitle: { fontSize: 11, marginTop: 2, marginBottom: 4 },
});
