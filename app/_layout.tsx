import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import SearchProvider from "@/providers/searchProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SearchProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/server"
            options={{ presentation: "modal", title: "Server URL" }}
          />
          <Stack.Screen
            name="modals/wsserver"
            options={{ presentation: "modal", title: "WebSocket Server URL" }}
          />
          <Stack.Screen
            name="modals/focusMode"
            options={{ presentation: "modal", title: "Focus Mode" }}
          />
          <Stack.Screen
            name="modals/optimizationMode"
            options={{ presentation: "modal", title: "Optimization Mode" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SearchProvider>
    </ThemeProvider>
  );
}
