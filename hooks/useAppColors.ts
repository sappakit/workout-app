import { AppColorScheme, THEME } from "@/lib/theme";
import { useThemeStore } from "@/stores/themeStore";

export function useAppColors() {
  const storedColorScheme = useThemeStore((state) => state.colorScheme);

  const colorScheme: AppColorScheme =
    storedColorScheme === "dark" ? "dark" : "light";

  return THEME[colorScheme];
}
