import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../src/theme/ThemeContext";
import { useGames } from "../src/context/GamesContext";
import { LibraryStatus, STATUS_LABELS, useLibrary } from "../src/context/LibraryContext";
import TopBar from "../src/components/TopBar";
import GameCard from "../src/components/GameCard";
import FilterPills from "../src/components/FilterPills";

// Tela "Minha lista" — filtros COMPLETO / JOGANDO / JOGAR DEPOIS /
// AVALIADO / NÃO AVALIADO / NÃO GOSTEI.
//
// - COMPLETO, JOGANDO, JOGAR DEPOIS e NÃO GOSTEI: status escolhido na
//   tela do jogo (ainda só em memória — veja LibraryContext.tsx).
// - AVALIADO: jogos em que você deixou comentário/nota (vem da API).
// - NÃO AVALIADO: jogos da sua lista que você ainda não avaliou.

type Filter = LibraryStatus | "avaliado" | "nao_avaliado";

// TEXTO EDITÁVEL — rótulos dos filtros
const FILTERS: { value: Filter; label: string }[] = [
  { value: "completo", label: STATUS_LABELS.completo },
  { value: "jogando", label: STATUS_LABELS.jogando },
  { value: "jogar_depois", label: STATUS_LABELS.jogar_depois },
  { value: "avaliado", label: "AVALIADO" },
  { value: "nao_avaliado", label: "NÃO AVALIADO" },
  { value: "nao_gostei", label: STATUS_LABELS.nao_gostei },
];

export default function Biblioteca() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { games } = useGames();
  const { statuses, myReviewFor } = useLibrary();
  const [filter, setFilter] = useState<Filter>("completo");

  const filteredGames = useMemo(
    () =>
      games.filter((g) => {
        if (filter === "avaliado") return !!myReviewFor(g.id);
        if (filter === "nao_avaliado") return !!statuses[g.id] && !myReviewFor(g.id);
        return statuses[g.id] === filter;
      }),
    [games, filter, statuses, myReviewFor]
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar />

      <View style={styles.content}>
        <FilterPills<Filter> options={FILTERS} selected={filter} onSelect={setFilter} />

        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const review = myReviewFor(item.id);
            const status = statuses[item.id];
            return (
              <GameCard
                game={item}
                subtitle={review?.body || (status ? STATUS_LABELS[status] : "")}
                rating={review?.rating}
                onPress={() => router.push(`/jogo/${item.id}`)}
              />
            );
          }}
          ListEmptyComponent={
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Nenhum jogo nesse filtro ainda. Abra um jogo no catálogo para adicioná-lo à sua lista.
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
