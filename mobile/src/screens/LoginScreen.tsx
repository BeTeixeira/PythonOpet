import React, { useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors, Radius, Spacing } from '../theme';
import { AppText } from '../components/ui/AppText';
import { Button } from '../components/ui/Button';

export const LoginScreen: React.FC = () => {
  const { loginAsMock } = useAuth();
  const logoScale = useRef(new Animated.Value(0.85)).current;

  React.useEffect(() => {
    Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 3, bounciness: 10 }).start();
  }, [logoScale]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoArea, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoIcon}>
            <Ionicons name="game-controller" size={52} color={Colors.accent} />
          </View>
          <AppText variant="h1" style={styles.appName}>Gamestar</AppText>
          <AppText variant="body" color="secondary" style={styles.tagline}>
            Descubra, avalie e colecione
          </AppText>
        </Animated.View>

        <View style={styles.buttons}>
          <AppText variant="caption" color="tertiary" style={styles.label}>MODO DEMONSTRAÇÃO</AppText>
          <Button label="Entrar como Usuário" variant="secondary" fullWidth onPress={() => loginAsMock('user')} />
          <Button label="Entrar como Administrador" variant="ghost" fullWidth onPress={() => loginAsMock('admin')} style={styles.adminBtn} />
        </View>

        <AppText variant="caption" color="tertiary" style={styles.footer}>
          Administradores podem cadastrar e editar jogos.{'\n'}
          Usuários podem avaliar e comentar.
        </AppText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center', gap: Spacing.xl },
  logoArea: { alignItems: 'center', gap: Spacing.sm },
  logoIcon: {
    width: 96, height: 96, borderRadius: Radius.xl,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  appName: { textAlign: 'center' },
  tagline: { textAlign: 'center' },
  buttons: { gap: Spacing.sm },
  label: { textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.xs },
  adminBtn: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md },
  footer: { textAlign: 'center', lineHeight: 17 },
});
