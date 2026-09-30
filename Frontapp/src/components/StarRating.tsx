import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme/ThemeContext";

type Props = {
  rating: number; // 0 a 5
  size?: number;
};

// ÍCONE EDITÁVEL: troque "star" / "star-outline" por qualquer outro
// nome de ícone da biblioteca Ionicons (ex: "heart", "heart-outline")
// para mudar o símbolo usado na avaliação.
export default function StarRating({ rating, size = 14 }: Props) {
  const { colors } = useAppTheme();
  const rounded = Math.round(rating);

  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rounded ? "star" : "star-outline"}
          size={size}
          color={colors.star}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}
