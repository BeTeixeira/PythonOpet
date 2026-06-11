import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Colors, Typography } from '../../theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'label' | 'caption';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'star' | 'error' | 'white';

interface AppTextProps {
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

const COLOR_MAP: Record<TextColor, string> = {
  primary: Colors.textPrimary,
  secondary: Colors.textSecondary,
  tertiary: Colors.textTertiary,
  accent: Colors.accent,
  star: Colors.star,
  error: Colors.error,
  white: Colors.white,
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  children,
  numberOfLines,
}) => (
  <Text
    style={[Typography[variant], { color: COLOR_MAP[color] }, style]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);
