import { AppDarkTheme, AppLightTheme, Colors } from "@/constants/theme";
import type { Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: Colors.appLight.background,
    foreground: Colors.appLight.textPrimary,

    card: Colors.appLight.cardPrimary,
    cardForeground: Colors.appLight.textPrimary,

    popover: Colors.appLight.cardPrimary,
    popoverForeground: Colors.appLight.textPrimary,

    primary: Colors.appLight.brand,
    primaryForeground: Colors.appLight.textWhite,

    secondary: Colors.appLight.cardSecondary,
    secondaryForeground: Colors.appLight.textPrimary,

    muted: Colors.appLight.cardTertiary,
    mutedForeground: Colors.appLight.textBlackMuted,

    accent: Colors.appLight.brandAccent,
    accentForeground: Colors.appLight.textWhite,

    destructive: Colors.appLight.error,

    border: Colors.appLight.borderPrimary,
    input: Colors.appLight.borderPrimary,
    ring: Colors.appLight.brand,

    radius: "0.625rem",

    chart1: Colors.appLight.brand,
    chart2: Colors.appLight.brandAccent,
    chart3: Colors.appLight.success,
    chart4: Colors.appLight.warning,
    chart5: Colors.appLight.error,
  },

  dark: {
    background: Colors.appDark.background,
    foreground: Colors.appDark.textWhite,

    card: Colors.appDark.cardPrimary,
    cardForeground: Colors.appDark.textWhite,

    popover: Colors.appDark.cardPrimary,
    popoverForeground: Colors.appDark.textWhite,

    primary: Colors.appDark.brand,
    primaryForeground: Colors.appDark.textWhite,

    secondary: Colors.appDark.cardSecondary,
    secondaryForeground: Colors.appDark.textWhite,

    muted: Colors.appDark.cardTertiary,
    mutedForeground: Colors.appDark.textPrimary,

    accent: Colors.appDark.brandAccent,
    accentForeground: Colors.appDark.textWhite,

    destructive: Colors.appDark.error,

    border: Colors.appDark.borderPrimary,
    input: Colors.appDark.borderPrimary,
    ring: Colors.appDark.brand,

    radius: "0.625rem",

    chart1: Colors.appDark.brand,
    chart2: Colors.appDark.brandAccent,
    chart3: Colors.appDark.success,
    chart4: Colors.appDark.warning,
    chart5: Colors.appDark.error,
  },
} as const;

export const NAV_THEME = {
  light: AppLightTheme,
  dark: AppDarkTheme,
} satisfies Record<"light" | "dark", Theme>;
