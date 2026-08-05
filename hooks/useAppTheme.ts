import type { AppTheme } from "@/constants/theme";
import { AppColorScheme, THEME } from "@/lib/theme";
import { useThemeStore } from "@/stores/themeStore";
import { useTheme } from "@react-navigation/native";

// TODO: remove (migrate to RNR theme system)
export function useAppTheme() {
  return useTheme() as AppTheme;
}

export function useAppColors() {
  const storedColorScheme = useThemeStore((state) => state.colorScheme);

  const colorScheme: AppColorScheme =
    storedColorScheme === "dark" ? "dark" : "light";

  return THEME[colorScheme];
}
