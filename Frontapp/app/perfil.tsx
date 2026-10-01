import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../src/components/Screen";
import { useAppTheme } from "../src/theme/ThemeContext";
import { useAuth } from "../src/context/AuthContext";
import { useLibrary } from "../src/context/LibraryContext";
import TopBar from "../src/components/TopBar";

// Tela de perfil — dados da conta logada e botão de sair.
export default function Perfil() {
  const { colors } = useAppTheme();
  const { user, isAdmin, logout } = useAuth();
  const { myReviews, statuses } = useLibrary();

  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <Screen>
      <TopBar />

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{user.username}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{user.email}</Text>
          {isAdmin && (
            <View style={[styles.badge, { borderColor: colors.accent }]}>
              <Ionicons name="shield-checkmark" size={11} color={colors.accent} />
              <Text style={{ fontSize: 10, color: colors.accent, fontWeight: "600" }}>ADMIN</Text>
            </View>
          )}

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{myReviews.length}</Text>
              {/* TEXTO EDITÁVEL */}
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avaliações</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{Object.keys(statuses).length}</Text>
              {/* TEXTO EDITÁVEL */}
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Na minha lista</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={[styles.logout, { borderColor: "#E05252" }]}>
          <Ionicons name="log-out-outline" size={16} color="#E05252" />
          <Text style={{ color: "#E05252", fontSize: 13, fontWeight: "600" }}>Sair</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 12, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: "center", gap: 4 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  avatarText: { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  name: { fontSize: 17, fontWeight: "700" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  stats: { flexDirection: "row", gap: 32, marginTop: 12 },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
});
