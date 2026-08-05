import { AppTheme, Colors } from "@/constants/theme";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// Both colors in 'lib/theme.ts' and in 'global.css' must match
export const THEME = {
  light: {
    // Page
    background: "#F7F5F2",
    foreground: "#171717",

    // Surfaces
    card: "#FFFFFF",
    cardForeground: "#171717",

    popover: "#FFFFFF",
    popoverForeground: "#171717",

    // Main brand actions
    primary: "#EF6131",
    primaryForeground: "#FFFFFF",
    primaryHover: "#D95227",

    // Secondary surfaces and controls
    secondary: "#F1EFEC",
    secondaryForeground: "#171717",

    // Muted surfaces and lower-priority text
    muted: "#F1EFEC",
    mutedForeground: "#76716C",
    subtleForeground: "#A29D98",

    // High-contrast controls
    accent: "#111111",
    accentForeground: "#FFFFFF",

    // Feedback
    success: "#1B9A59",
    successForeground: "#FFFFFF",

    warning: "#E5A11A",
    warningForeground: "#171717",

    destructive: "#DC3F3F",
    destructiveForeground: "#FFFFFF",

    // Structure
    border: "#DEDAD6",
    borderStrong: "#A9A49F",
    input: "#DEDAD6",
    ring: "#EF6131",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.48)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.68)",

    // Effects
    shadow: "rgba(39, 31, 25, 0.10)",

    // Loading
    skeleton: "#E9E5E1",
    skeletonHighlight: "#F5F3F0",

    // Shared component radius
    radius: "0.625rem",

    // Charts
    chart1: "#EF6131",
    chart2: "#111111",
    chart3: "#1B9A59",
    chart4: "#E5A11A",
    chart5: "#DC3F3F",
  },

  dark: {
    // Page
    background: "#0D0E0E",
    foreground: "#F5F5F3",

    // Surfaces
    card: "#171818",
    cardForeground: "#F5F5F3",

    popover: "#171818",
    popoverForeground: "#F5F5F3",

    // Main brand actions
    primary: "#EF6131",
    primaryForeground: "#FFFFFF",
    primaryHover: "#FA7E49",

    // Secondary surfaces and controls
    secondary: "#202121",
    secondaryForeground: "#F5F5F3",

    // Muted surfaces and lower-priority text
    muted: "#202121",
    mutedForeground: "#A5A5A1",
    subtleForeground: "#747572",

    // High-contrast controls
    accent: "#F4F4F2",
    accentForeground: "#171717",

    // Feedback
    success: "#2AB66B",
    successForeground: "#FFFFFF",

    warning: "#E8AC32",
    warningForeground: "#171717",

    destructive: "#EF5555",
    destructiveForeground: "#FFFFFF",

    // Structure
    border: "#303130",
    borderStrong: "#484947",
    input: "#303130",
    ring: "#EF6131",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.32)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.62)",

    // Effects
    shadow: "rgba(0, 0, 0, 0.45)",

    // Loading
    skeleton: "#202121",
    skeletonHighlight: "#2A2B2B",

    // Shared component radius
    radius: "0.625rem",

    // Charts
    chart1: "#EF6131",
    chart2: "#F4F4F2",
    chart3: "#2AB66B",
    chart4: "#E8AC32",
    chart5: "#EF5555",
  },
} as const;

export type AppColorScheme = keyof typeof THEME;

export type SemanticTheme = {
  [Key in keyof typeof THEME.light]: string;
};

export const NAV_THEME = {
  light: {
    ...DefaultTheme,

    colors: {
      ...DefaultTheme.colors,

      background: THEME.light.background,
      card: THEME.light.card,
      text: THEME.light.foreground,
      border: THEME.light.border,
      primary: THEME.light.primary,
      notification: THEME.light.destructive,

      // TODO: Temporary legacy compatibility (remove after migrate)
      app: Colors.appLight,
    },
  },

  dark: {
    ...DarkTheme,

    colors: {
      ...DarkTheme.colors,

      background: THEME.dark.background,
      card: THEME.dark.card,
      text: THEME.dark.foreground,
      border: THEME.dark.border,
      primary: THEME.dark.primary,
      notification: THEME.dark.destructive,

      // TODO: Temporary legacy compatibility (remove after migrate)
      app: Colors.appDark,
    },
  },
} satisfies Record<AppColorScheme, AppTheme>;
