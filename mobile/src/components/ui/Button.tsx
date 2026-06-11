import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: Colors.accent },
  secondary: {
    backgroundColor: Colors.surfaceMid,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  icon: {
    backgroundColor: Colors.surfaceMid,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 44,
    height: 44,
    borderRadius: Radius.md,
  },
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, minHeight: 36 },
  md: { paddingVertical: 13, paddingHorizontal: 22, minHeight: 48 },
  lg: { paddingVertical: 17, paddingHorizontal: 28, minHeight: 56 },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  style,
  fullWidth = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 60, bounciness: 4 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 4 }).start();

  const isIcon = variant === 'icon';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          styles.base,
          VARIANT_STYLES[variant],
          !isIcon && SIZE_STYLES[size],
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon && <View style={label ? styles.iconGap : undefined}>{icon}</View>}
        {label && (
          <AppText variant="label" color={variant === 'primary' ? 'white' : 'primary'}>
            {label.toUpperCase()}
          </AppText>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  fullWidth: { width: '100%' },
  iconGap: { marginRight: Spacing.xs },
  disabled: { opacity: 0.38 },
});
