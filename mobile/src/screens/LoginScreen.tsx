import React, { useRef } from 'react';
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import { Colors, Radius, Spacing } from '../theme';
import { AppText } from '../components/ui/AppText';
import { Button } from '../components/ui/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = () => {
  const { loginAsMock } = useAuth();
  const logoScale = useRef(new Animated.Value(0.85)).current;

  React.useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 3,
      bounciness: 10,
    }).start();
  }, [logoScale]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        {/* Logo area */}
        <Animated.View style={[styles.logoArea, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoIcon}>
            <Ionicons name="game-controller" size={52} color={Colors.accent} />
          </View>
          <AppText variant="h1" style={styles.appName}>
            Gamestar
          </AppText>
          <AppText variant="body" color="secondary" style={styles.tagline}>
            Descubra, avalie e colecione
          </AppText>
        </Animated.View>

        {/* Auth buttons */}
        <View style={styles.authArea}>
          {/* GitHub OAuth — connects to the real API in production */}
          <TouchableOpacity
            style={styles.githubButton}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                'Login com GitHub',
                'Configure GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET na API para ativar o OAuth real. Use o modo demonstração abaixo para explorar o app.',
                [{ text: 'Entendido' }]
              )
            }
          >
            <Ionicons name="logo-github" size={22} color={Colors.white} style={styles.githubIcon} />
            <AppText variant="label" style={styles.githubLabel}>
              ENTRAR COM GITHUB
            </AppText>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <AppText variant="caption" color="tertiary" style={styles.dividerText}>
              MODO DEMONSTRAÇÃO
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          <Button
            label="Entrar como Usuário"
            variant="secondary"
            fullWidth
            onPress={() => loginAsMock('user')}
          />

          <Button
            label="Entrar como Administrador"
            variant="ghost"
            fullWidth
            onPress={() => loginAsMock('admin')}
            style={styles.adminButton}
          />
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
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  logoArea: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  appName: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
  },
  authArea: {
    gap: Spacing.sm,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24292e',
    borderRadius: Radius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.borderHigh,
    gap: Spacing.sm,
  },
  githubIcon: {
    marginRight: 2,
  },
  githubLabel: {
    color: Colors.white,
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    letterSpacing: 1,
  },
  adminButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  footer: {
    textAlign: 'center',
    lineHeight: 17,
  },
});
