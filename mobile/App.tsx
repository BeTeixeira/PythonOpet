import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    NavigationBar.setVisibilityAsync('hidden');
    // 'overlay-swipe': barra aparece brevemente ao deslizar de baixo e some sozinha
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <AppNavigator />
    </AuthProvider>
  );
}
