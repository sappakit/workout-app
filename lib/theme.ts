import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

// Both colors in 'lib/theme.ts' and in 'global.css' must match
export const THEME = {
  light: {
    // Page
    background: "#F3F2F0",
    foreground: "#161616",

    // Surfaces
    card: "#FFFFFF",
    cardForeground: "#161616",

    popover: "#FFFFFF",
    popoverForeground: "#161616",

    // Main brand actions
    primary: "#EF6131",
    primaryHover: "#D9572C",
    primaryForeground: "#FFFFFF",

    // Secondary surfaces and controls
    secondary: "#E8E7E4",
    secondaryHover: "#DEDDDA",
    secondaryForeground: "#1B1B1B",

    // Muted surfaces and lower-priority text
    muted: "#EFEEEB",
    mutedForeground: "#6F6E6A",
    subtleForeground: "#999792",

    // Interactive highlight
    accent: "#E8E7E4",
    accentForeground: "#161616",

    // High-contrast controls
    contrast: "#111111",
    contrastHover: "#2A2A2A",
    contrastForeground: "#FFFFFF",

    // Feedback
    success: "#1B9A59",
    successForeground: "#FFFFFF",

    warning: "#E5A11A",
    warningForeground: "#171717",

    destructive: "#DC3F3F",
    destructiveHover: "#C93636",
    destructiveForeground: "#FFFFFF",

    // Structure
    border: "#D8D7D3",
    borderStrong: "#AAA8A3",
    input: "#E2E1DE",
    ring: "#EF6131",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.42)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.62)",

    // Effects
    shadow: "rgba(25, 25, 23, 0.08)",

    // Loading
    skeleton: "#E9E8E5",
    skeletonHighlight: "#F6F5F3",

    // Shared component radius
    radius: "0.625rem",

    // Charts
    chart1: "#EF6131",
    chart2: "#555553",
    chart3: "#1B9A59",
    chart4: "#E5A11A",
    chart5: "#DC3F3F",
  },

  dark: {
    // Page
    background: "#1D1D1D",
    foreground: "#F5F5F3",

    // Surfaces
    card: "#252525",
    cardForeground: "#F5F5F3",

    popover: "#252525",
    popoverForeground: "#F5F5F3",

    // Main brand actions
    primary: "#EF6131",
    primaryHover: "#D9572C",
    primaryForeground: "#FFFFFF",

    // Secondary surfaces and controls
    secondary: "#2E2E2E",
    secondaryHover: "#3A3A3A",
    secondaryForeground: "#F5F5F3",

    // Muted surfaces and lower-priority text
    muted: "#2E2E2E",
    mutedForeground: "#A8A8A4",
    subtleForeground: "#7F7F7A",

    // Interactive highlight
    accent: "#2E2E2E",
    accentForeground: "#F5F5F3",

    // High-contrast controls
    contrast: "#F4F4F2",
    contrastHover: "#DDDDDA",
    contrastForeground: "#171717",

    // Feedback
    success: "#2AB66B",
    successForeground: "#FFFFFF",

    warning: "#E8AC32",
    warningForeground: "#171717",

    destructive: "#EF5555",
    destructiveHover: "#D94A4A",
    destructiveForeground: "#FFFFFF",

    // Structure
    border: "#3A3A3A",
    borderStrong: "#555555",
    input: "#3A3A3A",
    ring: "#EF6131",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.32)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.62)",

    // Effects
    shadow: "rgba(0, 0, 0, 0.40)",

    // Loading
    skeleton: "#2B2B2B",
    skeletonHighlight: "#353535",

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
    },
  },
} satisfies Record<AppColorScheme, Theme>;
