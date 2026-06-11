import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../theme';

interface CardProps {
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  onPress,
  style,
  children,
  pressable = true,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (!onPress) return;
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  };

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressable ? onPressIn : undefined}
        onPressOut={pressable ? onPressOut : undefined}
        style={styles.inner}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  inner: { flex: 1 },
});
