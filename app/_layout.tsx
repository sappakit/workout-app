import { AuthGate } from "@/components/guards/AuthGate";
import { AppDarkTheme, AppLightTheme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { createToastConfig } from "@/lib/toast/config";
import { useThemeStore } from "@/stores/themeStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "./global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const theme = colorScheme === "dark" ? AppDarkTheme : AppLightTheme;

  // Toast
  const toastConfig = createToastConfig(colorScheme);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <MenuProvider>
              <AuthProvider>
                <AuthGate>
                  <>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                    >
                      <Stack.Screen name="(tabs)" />
                    </Stack>

                    <StatusBar
                      style={colorScheme === "dark" ? "light" : "dark"}
                    />

                    <Toast config={toastConfig} />
                  </>
                </AuthGate>
              </AuthProvider>
            </MenuProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
