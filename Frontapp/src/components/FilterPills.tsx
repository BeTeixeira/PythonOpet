import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "../theme/ThemeContext";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
};

// Usado na tela "Minha lista" para os filtros
// (COMPLETO / JOGANDO / JOGAR DEPOIS / AVALIADO / NÃO AVALIADO / NÃO GOSTEI).
// Para adicionar um novo filtro, basta incluir mais um item no array
// `options` passado pela tela que usa este componente.
export default function FilterPills<T extends string>({ options, selected, onSelect }: Props<T>) {
  const { colors } = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.pill,
              { backgroundColor: active ? colors.pillActive : colors.pillInactive, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={{ fontSize: 11, color: active ? colors.pillTextActive : colors.pillTextInactive }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 6, paddingBottom: 10 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
});
