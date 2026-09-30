import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../src/theme/ThemeContext";
import { games, GameStatus } from "../src/data/games";
import TopBar from "../src/components/TopBar";
import GameCard from "../src/components/GameCard";
import FilterPills from "../src/components/FilterPills";

// Tela "Minha lista" — terceira e quarta telas do mockup, com os
// filtros COMPLETO / JOGANDO / JOGAR DEPOIS / AVALIADO / NÃO AVALIADO / NÃO GOSTEI.

// TEXTO EDITÁVEL — rótulos dos filtros. O `value` precisa bater com o
// campo `status` usado em src/data/games.ts.
const FILTERS: { value: GameStatus; label: string }[] = [
  { value: "completo", label: "COMPLETO" },
  { value: "jogando", label: "JOGANDO" },
  { value: "jogar_depois", label: "JOGAR DEPOIS" },
  { value: "avaliado", label: "AVALIADO" },
  { value: "nao_avaliado", label: "NÃO AVALIADO" },
  { value: "nao_gostei", label: "NÃO GOSTEI" },
];

export default function Biblioteca() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<GameStatus>("completo");

  const filteredGames = games.filter((g) => g.status === filter);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar />

      <View style={styles.content}>
        <FilterPills options={FILTERS} selected={filter} onSelect={setFilter} />

        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              variant="library"
              onPress={() => router.push(`/jogo/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Nenhum jogo nesse filtro ainda.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: 12 },
});
