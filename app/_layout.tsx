import { AuthProvider } from "@/context/AuthContext";
import { useNotificationPermissions } from "@/hooks/useNotificationPermissions";
import { NAV_THEME, type AppColorScheme } from "@/lib/theme";
import { createToastConfig } from "@/lib/toast/config";
import { useThemeStore } from "@/stores/themeStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colorScheme as nativeWindColorScheme } from "nativewind";
import { useEffect } from "react";
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
  const storedColorScheme = useThemeStore((state) => state.colorScheme);

  const colorScheme: AppColorScheme =
    storedColorScheme === "dark" ? "dark" : "light";

  const navigationTheme = NAV_THEME[colorScheme];
  const toastConfig = createToastConfig(colorScheme);

  useNotificationPermissions();

  // Keep NativeWind synchronized with the app theme store.
  useEffect(() => {
    nativeWindColorScheme.set(colorScheme);
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <MenuProvider>
              <AuthProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                >
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(pages)" />
                  <Stack.Screen name="(modal)" />
                </Stack>

                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

                <Toast config={toastConfig} />

                <PortalHost />
              </AuthProvider>
            </MenuProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
