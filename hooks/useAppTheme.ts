import type { AppTheme } from "@/constants/theme";
import { useTheme } from "@react-navigation/native";

export function useAppTheme() {
  return useTheme() as AppTheme;
}
