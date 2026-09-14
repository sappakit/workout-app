import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, type ColorSchemeName } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  setMode: (mode: ThemeMode) => void;

  // Updates colorScheme from system only if mode === "system"
  syncWithSystem: () => void;

  // Prevents flicker on launch
  hasHydrated: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      colorScheme: getSystemColorScheme(),
      hasHydrated: false,

      setMode: (mode) => {
        const systemScheme = getSystemColorScheme();

        set({
          mode,
          colorScheme: mode === "system" ? systemScheme : mode,
        });
      },

      syncWithSystem: () => {
        if (get().mode !== "system") {
          return;
        }

        set({
          colorScheme: getSystemColorScheme(),
        });
      },
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => AsyncStorage),

      // Persist only the user's choice
      partialize: (state) => ({
        mode: state.mode,
      }),

      // When mode is loaded from storage, recompute colorScheme
      onRehydrateStorage: () => (state) => {
        const mode = state?.mode ?? "system";

        state?.setMode(mode);

        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);

function getSystemColorScheme(): ColorSchemeName {
  return Appearance.getColorScheme() ?? "light";
}
