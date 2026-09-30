import React from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../src/theme/ThemeContext";
import { games } from "../src/data/games";
import TopBar from "../src/components/TopBar";
import GameCard from "../src/components/GameCard";

// Tela inicial / Catálogo — primeira e segunda telas do mockup.
export default function Home() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar />

      <View style={styles.content}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Ionicons name="search" size={14} color={colors.textSecondary} />
          {/* TEXTO EDITÁVEL — placeholder do campo de busca */}
          <TextInput
            placeholder="search"
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>

        {/* TEXTO EDITÁVEL — título da lista */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Jogos recomendados</Text>

        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              variant="catalog"
              // CAMINHO DE NAVEGAÇÃO: leva para app/jogo/[id].tsx passando o id do jogo
              onPress={() => router.push(`/jogo/${item.id}`)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 12 },
  sectionTitle: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
});
