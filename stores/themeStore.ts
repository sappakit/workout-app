import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: ColorSchemeName;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "system",
  colorScheme: Appearance.getColorScheme(),

  setMode: (mode) => {
    const systemScheme = Appearance.getColorScheme();

    set({
      mode,
      colorScheme: mode === "system" ? systemScheme : mode,
    });
  },
}));
