import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../src/theme/ThemeContext";

// Layout raiz do app. Cada tela usa sua própria <TopBar />, então o
// cabeçalho padrão do Stack fica desligado (headerShown: false).
//
// PARA ADICIONAR UMA NOVA ROTA à navegação em pilha (stack), normalmente
// não é preciso mexer aqui — basta criar o arquivo em /app. Esta tela
// só precisa de ajuste se você quiser opções específicas por rota
// (ex: animação diferente, título na barra nativa, etc.).
export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="biblioteca" />
          <Stack.Screen name="amigos" />
          <Stack.Screen name="jogo/[id]" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
