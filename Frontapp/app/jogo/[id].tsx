import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../src/theme/ThemeContext";
import { games } from "../../src/data/games";
import TopBar from "../../src/components/TopBar";
import StarRating from "../../src/components/StarRating";

// Tela de Detalhe do jogo — sétima e oitava telas do mockup.
// Rota dinâmica: o nome do arquivo "[id].tsx" vira um parâmetro.
// Ex: router.push("/jogo/1") abre esta tela com id = "1".
export default function DetalheJogo() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const game = games.find((g) => g.id === id);

  if (!game) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <TopBar />
        <View style={styles.content}>
          <Text style={{ color: colors.textPrimary }}>Jogo não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar />

      <FlatList
        data={game.comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
              <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
              {/* TEXTO EDITÁVEL */}
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 4 }}>Catálogo</Text>
            </TouchableOpacity>

            {/* IMAGEM EDITÁVEL — veja instruções em src/data/games.ts */}
            {game.image ? (
              <Image source={game.image} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder, { backgroundColor: colors.card }]}>
                {/* TEXTO EDITÁVEL */}
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Imagens do jogo</Text>
              </View>
            )}

            <Text style={[styles.title, { color: colors.textPrimary }]}>{game.title}</Text>
            <Text style={[styles.genre, { color: colors.textSecondary }]}>{game.genre}</Text>

            {/* TEXTO EDITÁVEL */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sinopse do jogo</Text>
            <Text style={[styles.synopsis, { color: colors.textSecondary }]}>{game.synopsis}</Text>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notas</Text>
            <View style={styles.ratingsRow}>
              <View>
                {/* TEXTO EDITÁVEL */}
                <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Geral</Text>
                <StarRating rating={game.ratingGeral} size={16} />
              </View>
              <View>
                {/* TEXTO EDITÁVEL */}
                <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Especialistas</Text>
                <StarRating rating={game.ratingEspecialistas} size={16} />
              </View>
            </View>

            {/* Botão só visual por enquanto — ligue a uma tela/lista completa de notas depois */}
            <TouchableOpacity style={[styles.smallButton, { borderColor: colors.cardBorder }]}>
              <Text style={{ fontSize: 11, color: colors.textPrimary }}>Mais notas</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Comentários</Text>

            {/* Botão só visual por enquanto — ligue a um formulário de comentário depois */}
            <TouchableOpacity style={[styles.smallButton, { borderColor: colors.accent, marginBottom: 10 }]}>
              <Text style={{ fontSize: 11, color: colors.accent }}>Deixar um comentário</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.commentCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="person-circle-outline" size={22} color={colors.textSecondary} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textPrimary }}>{item.author}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{item.text}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 12 },
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cover: { width: "100%", height: 110, borderRadius: 10, marginBottom: 12 },
  coverPlaceholder: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: 17, fontWeight: "700" },
  genre: { fontSize: 11, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  synopsis: { fontSize: 12, lineHeight: 18 },
  ratingsRow: { flexDirection: "row", gap: 24, marginBottom: 8 },
  ratingLabel: { fontSize: 10, marginBottom: 4 },
  smallButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  commentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
});
