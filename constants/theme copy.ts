/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// TODO: remove file
const appColors = {
  // Base
  white: "#FFFFFF",
  black: "#000000",

  // Text
  textWhite: "#FFFFFF",
  textWhiteMuted: "#D1D1D1",
  textBlack: "#2D2D2D",
  textBlackMuted: "#7A7A7A",

  // Brand
  // #FD8036, #FA3469, #DB4B4B, #E37531, #F36840
  brand: "#EF6131",
  brandLight: "#FA7E49",
  brandDark: "#BF4F28",
  brandAccent: "#246CD1",

  // Status
  success: "#01B008",
  warning: "#FFC107",
  error: "#F44336",

  // Icons / Tabs
  icon: "#687076",
  tabIconDefault: "#687076",
  tabIconSelected: "#D1AD70",
} as const;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },

  // TODO: remove old light theme
  appLightLegacy: {
    ...appColors,

    // Base
    background: "#F1F1F1",
    backgroundDark: "#EFEFEF",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Text
    textPrimary: "#323232",
    textSecondary: "#D9D9D9",
    textAccent: "#2D2D2D",

    // Border
    borderPrimary: "#D3D3D3",
    borderSecondary: "#C3C3C3",
    borderTertiary: "#AAAAAA",

    // Card
    cardPrimary: "#FFFFFF",
    cardPrimaryDark: "#F8F8F8",
    cardSecondary: "#F0F0F0",
    cardTertiary: "#EFEFEF",

    // Button background
    buttonBgPrimary: "#EF6131",
    buttonBgSecondary: "#F0F0F0",
    buttonBgTertiary: "#EFEFEF",

    // Toast
    toastBackground: "#FFFFFF",

    // Skeleton
    skeletonBase: "#FFFFFF",
    skeletonHighlight: "#F8F8F8",
  },

  // TODO: remove old dark theme
  appDarkLegacy: {
    ...appColors,

    // Base
    background: "#1D1D1D",
    backgroundDark: "#171717",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Text
    textPrimary: "#9C9C9C",
    textSecondary: "#D9D9D9",
    textAccent: "#FFFFFF",

    // Border
    borderPrimary: "#3B3B3B",
    borderSecondary: "#8F8F8F",
    borderTertiary: "#3B3B3B",

    // Card
    cardPrimary: "#222222",
    cardPrimaryDark: "#1D1D1D",
    cardSecondary: "#323232",
    cardTertiary: "#3B3B3B",

    // Button background
    buttonBgPrimary: "#EF6131",
    buttonBgSecondary: "#222222",
    buttonBgTertiary: "#323232",

    // Toast
    toastBackground: "#222222",

    // Skeleton
    skeletonBase: "#222222",
    skeletonHighlight: "#2B2B2B",
  },

  appLight: {
    // Page
    background: "#F7F5F2",
    foreground: "#171717",

    // Surfaces
    surface: "#FFFFFF",
    surfaceMuted: "#F1EFEC",

    // Text
    mutedForeground: "#76716C",
    subtleForeground: "#A29D98",

    // Brand
    primary: "#EF6131",
    primaryForeground: "#FFFFFF",
    primaryHover: "#D95227",

    // High-contrast controls
    contrast: "#111111",
    contrastForeground: "#FFFFFF",

    // Structure
    border: "#DEDAD6",
    borderStrong: "#A9A49F",

    // Feedback
    success: "#1B9A59",
    successForeground: "#FFFFFF",

    warning: "#E5A11A",
    warningForeground: "#171717",

    destructive: "#DC3F3F",
    destructiveForeground: "#FFFFFF",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.48)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.68)",

    // Effects
    shadow: "rgba(39, 31, 25, 0.10)",

    // Loading
    skeleton: "#E9E5E1",
    skeletonHighlight: "#F5F3F0",
  },

  appDark: {
    // Page
    background: "#0D0E0E",
    foreground: "#F5F5F3",

    // Surfaces
    surface: "#171818",
    surfaceMuted: "#202121",

    // Text
    mutedForeground: "#A5A5A1",
    subtleForeground: "#747572",

    // Brand
    primary: "#EF6131",
    primaryForeground: "#FFFFFF",
    primaryHover: "#FA7E49",

    // High-contrast controls
    contrast: "#F4F4F2",
    contrastForeground: "#171717",

    // Structure
    border: "#303130",
    borderStrong: "#484947",

    // Feedback
    success: "#2AB66B",
    successForeground: "#FFFFFF",

    warning: "#E8AC32",
    warningForeground: "#171717",

    destructive: "#EF5555",
    destructiveForeground: "#FFFFFF",

    // Image content
    imageOverlay: "rgba(0, 0, 0, 0.32)",
    imageOverlayStrong: "rgba(0, 0, 0, 0.62)",

    // Effects
    shadow: "rgba(0, 0, 0, 0.45)",

    // Loading
    skeleton: "#202121",
    skeletonHighlight: "#2A2B2B",
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Widen color values from string literals to string
export type LegacyAppColors = {
  [Key in keyof typeof Colors.appLightLegacy]: string;
};

export type AppColors = {
  [Key in keyof typeof Colors.appLight]: string;
};

export type AppTheme = Theme & {
  colors: Theme["colors"] & {
    // Existing colors used by screens that have not been migrated
    app: LegacyAppColors;

    // New semantic colors used by migrated screens
    appV2: AppColors;
  };
};

export const AppLightTheme: AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    // Navigation
    // Keep navigation on the legacy theme during migration
    background: Colors.appLightLegacy.background,
    card: Colors.appLightLegacy.cardPrimary,
    text: Colors.appLightLegacy.textPrimary,
    border: Colors.appLightLegacy.borderPrimary,
    primary: Colors.appLightLegacy.brand,

    // App-specific (custom)
    app: Colors.appLightLegacy,

    // New semantic theme
    appV2: Colors.appLight,
  },
};

export const AppDarkTheme: AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,

    // Navigation
    // Keep navigation on the legacy theme during migration
    background: Colors.appDarkLegacy.background,
    card: Colors.appDarkLegacy.cardPrimary,
    text: Colors.appDarkLegacy.textWhite,
    border: Colors.appDarkLegacy.borderPrimary,
    primary: Colors.appDarkLegacy.brand,

    // App-specific (custom)
    app: Colors.appDarkLegacy,

    // New semantic theme
    appV2: Colors.appDark,
  },
};

// helpers
export const hexWithOpacity = (hexColor: string, opacity: number) => {
  const normalizedHex = hexColor.replace("#", "").slice(0, 6);
  const normalizedOpacity = Math.max(0, Math.min(100, opacity));

  const alpha = Math.round((normalizedOpacity / 100) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  return `#${normalizedHex}${alpha}`;
};
