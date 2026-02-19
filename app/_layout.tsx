import { AuthGate } from "@/components/guards/AuthGate";
import { AppDarkTheme, AppLightTheme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { useThemeStore } from "@/stores/themeStore";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const theme = colorScheme === "dark" ? AppDarkTheme : AppLightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <AuthGate>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
