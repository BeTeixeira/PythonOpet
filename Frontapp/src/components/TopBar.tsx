import React from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../theme/ThemeContext";

// ============================================================
// BARRA SUPERIOR — aparece em todas as telas.
//
// COMO NAVEGAR DE UMA TELA PARA OUTRA (Expo Router):
//   1) Toda tela é um arquivo dentro de /app. O nome/caminho do
//      arquivo VIRA o caminho de navegação. Ex: app/amigos.tsx
//      é acessado com router.push("/amigos").
//   2) Para ir a uma tela, use o hook useRouter() e chame
//      router.push("/caminho-da-tela"), como nos botões abaixo.
//   3) Para criar uma nova tela: crie um novo arquivo em /app
//      (ex: app/perfil.tsx) e adicione aqui um novo botão com
//      router.push("/perfil").
// ============================================================

export default function TopBar() {
  const { colors, theme, toggleTheme } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBackground, borderColor: colors.cardBorder }]}>
      <View style={styles.iconGroup}>
        {/* ÍCONE/CAMINHO EDITÁVEL — "star" leva para a lista de avaliados */}
        <TouchableOpacity onPress={() => router.push("/biblioteca")} hitSlop={8}>
          <Ionicons name="star-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* ÍCONE/CAMINHO EDITÁVEL — "game-controller" leva para o catálogo (Home) */}
        <TouchableOpacity onPress={() => router.push("/")} hitSlop={8}>
          <Ionicons name="game-controller-outline" size={18} color={colors.textPrimary} style={styles.icon} />
        </TouchableOpacity>

        {/* ÍCONE/CAMINHO EDITÁVEL — "people" leva para a tela de amigos */}
        <TouchableOpacity onPress={() => router.push("/amigos")} hitSlop={8}>
          <Ionicons name="people-outline" size={18} color={colors.textPrimary} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* TEXTO EDITÁVEL — nome do app. "Star" usa a cor de destaque (accent). */}
      <Text style={[styles.logo, { color: colors.textPrimary }]}>
        Game<Text style={{ color: colors.accent }}>Star</Text>
      </Text>

      <View style={styles.iconGroup}>
        <Switch value={theme === "light"} onValueChange={toggleTheme} />

        {/* Ícone de perfil — hoje sem tela associada.
            Para ligar a um perfil: crie app/perfil.tsx e troque a
            linha abaixo por router.push("/perfil"). */}
        <TouchableOpacity onPress={() => {}} hitSlop={8} style={styles.icon}>
          <Ionicons name="person-circle-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconGroup: { flexDirection: "row", alignItems: "center" },
  icon: { marginLeft: 12 },
  logo: { fontSize: 15, fontWeight: "700" },
});
