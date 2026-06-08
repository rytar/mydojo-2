import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Palette } from '@/constants/theme';

const myDojoTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.paper,
    card: Palette.paper,
    primary: Palette.oxblood,
    text: Palette.ink,
    border: Palette.line,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={myDojoTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.paper } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="program/[id]" />
        <Stack.Screen name="catalog/[category]" />
      </Stack>
    </ThemeProvider>
  );
}
