import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../src/theme/ThemeContext";
import { friends, pendingRequests } from "../src/data/friends";
import TopBar from "../src/components/TopBar";
import FriendCard from "../src/components/FriendCard";

// Tela de Amigos — quinta e sexta telas do mockup.
export default function Amigos() {
  const { colors } = useAppTheme();
  const [tab, setTab] = useState<"amigos" | "pendentes">("amigos");
  const list = tab === "amigos" ? friends : pendingRequests;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopBar />

      <View style={styles.content}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab("amigos")}
            style={[
              styles.tab,
              { backgroundColor: tab === "amigos" ? colors.pillActive : colors.pillInactive, borderColor: colors.cardBorder },
            ]}
          >
            {/* TEXTO EDITÁVEL */}
            <Text style={{ fontSize: 12, color: tab === "amigos" ? colors.pillTextActive : colors.pillTextInactive }}>
              Amigos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("pendentes")}
            style={[
              styles.tab,
              { backgroundColor: tab === "pendentes" ? colors.pillActive : colors.pillInactive, borderColor: colors.cardBorder },
            ]}
          >
            {/* TEXTO EDITÁVEL */}
            <Text style={{ fontSize: 12, color: tab === "pendentes" ? colors.pillTextActive : colors.pillTextInactive }}>
              Solicitações pendentes
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FriendCard friend={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: 12 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
});
