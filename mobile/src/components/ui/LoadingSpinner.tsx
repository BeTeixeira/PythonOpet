import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from './AppText';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  overlay?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  overlay = false,
  message,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.55, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const content = (
    <Animated.View style={[styles.card, { opacity: pulseAnim }]}>
      <ActivityIndicator size={size} color={Colors.accent} />
      {message && (
        <AppText variant="bodySmall" color="secondary" style={styles.message}>
          {message}
        </AppText>
      )}
    </Animated.View>
  );

  if (overlay) {
    return <View style={styles.overlay}>{content}</View>;
  }

  return content;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderHigh,
    padding: Spacing.xl,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
