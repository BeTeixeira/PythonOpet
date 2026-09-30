import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Friend } from "../data/friends";
import { useAppTheme } from "../theme/ThemeContext";

type Props = {
  friend: Friend;
  onOptionsPress?: () => void;
};

export default function FriendCard({ friend, onOptionsPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {friend.avatar ? (
        <Image source={friend.avatar} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder, { borderColor: colors.cardBorder }]}>
          <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {friend.name}
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]} numberOfLines={1}>
          {friend.info}
        </Text>
      </View>

      {/* Botão "⋮" — hoje é só visual. Ligue o onOptionsPress a um
          menu (ex: remover amigo) quando o back-end existir. */}
      <TouchableOpacity onPress={onOptionsPress} hitSlop={8}>
        <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
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
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
  name: { fontSize: 13, fontWeight: "600" },
  info: { fontSize: 11, marginTop: 2 },
});
