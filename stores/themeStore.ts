import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  setMode: (mode: ThemeMode) => void;

  // updates colorScheme from system ONLY if mode === "system"
  syncWithSystem: () => void;

  // prevents flicker on launch
  hasHydrated: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      colorScheme: Appearance.getColorScheme(),
      hasHydrated: false,

      setMode: (mode) => {
        const systemScheme = Appearance.getColorScheme();
        set({
          mode,
          colorScheme: mode === "system" ? systemScheme : mode,
        });
      },

      syncWithSystem: () => {
        if (get().mode !== "system") return;
        set({ colorScheme: Appearance.getColorScheme() });
      },
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => AsyncStorage),

      // Persist ONLY the user's choice
      partialize: (state) => ({ mode: state.mode }),

      // When mode is loaded from storage, recompute colorScheme
      onRehydrateStorage: () => (state) => {
        const mode = state?.mode ?? "system";
        state?.setMode(mode);
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
