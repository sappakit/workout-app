import { type AppColorScheme, THEME } from "@/lib/theme";
import type { ColorSchemeName } from "react-native";
import {
  BaseToast,
  ErrorToast,
  type ToastConfig,
} from "react-native-toast-message";

export const createToastConfig = (
  colorScheme: ColorSchemeName,
): ToastConfig => {
  const resolvedColorScheme: AppColorScheme =
    colorScheme === "dark" ? "dark" : "light";

  const colors = THEME[resolvedColorScheme];

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success,
          backgroundColor: colors.popover,
          borderRadius: 14,
        }}
        text1Style={{
          color: colors.foreground,
          fontWeight: "600",
        }}
        text2Style={{
          color: colors.mutedForeground,
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.destructive,
          backgroundColor: colors.popover,
          borderRadius: 14,
        }}
        text1Style={{
          color: colors.foreground,
          fontWeight: "600",
        }}
        text2Style={{
          color: colors.mutedForeground,
        }}
      />
    ),

    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.warning,
          backgroundColor: colors.popover,
          borderRadius: 14,
        }}
        text1Style={{
          color: colors.foreground,
          fontWeight: "600",
        }}
        text2Style={{
          color: colors.mutedForeground,
        }}
      />
    ),
  };
};
