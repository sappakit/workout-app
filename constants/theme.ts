/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const appColors = {
  // Text
  textDim: "#414141",
  textMuted: "#D9D9D9",
  textExtra: "#AAAAAA",
  textWhite: "#FFFFFF",
  textBlack: "#000000",

  // Brand
  brand: "#FD8036",
  brandLight: "#FFA552",
  brandDark: "#C45818",
  brandAccent: "#246CD1",

  // Status
  success: "#01B008",
  warning: "#FFC107",
  error: "#E60012",

  // Icons / Tabs
  icon: "#687076",
  tabIconDefault: "#687076",
  tabIconSelected: "#D1AD70",
};

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

  appLight: {
    ...appColors,

    // Base
    background: "#F5F5F5",
    backgroundWhite: "#FFFFFF",
    backgroundBlack: "#000000",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Page header
    pageHeaderBackground: "#F8F8FA",

    // Text
    textPrimary: "#8C8C8C",
    textSecondary: "#AEAEAE",
    textAccent: "#2D2D2D",

    // Border
    borderPrimary: "#D7D7D7",
    borderSecondary: "#C3C3C3",

    // Card
    cardPrimary: "#FFFFFF",
    cardSecondary: "#E3E3E3",

    // Streak
    streakPrimary: "0F0F0F",
    streakSecondary: "1D1D1D",
  },

  appDark: {
    ...appColors,

    // Base
    background: "#090909",
    backgroundWhite: "#FFFFFF",
    backgroundBlack: "#000000",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Page header
    pageHeaderBackground: "#0D0D0D",

    // Text
    textPrimary: "#8F8F8F",
    textSecondary: "#2D2D2D",
    textAccent: "#FFFFFF",

    // Border
    borderPrimary: "#1D1D1D",
    borderSecondary: "#2D2D2D",

    // Card
    cardPrimary: "#0F0F0F",
    cardSecondary: "#1D1D1D",

    // Streak
    streakPrimary: "0F0F0F",
    streakSecondary: "1D1D1D",
  },
};

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

export const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    // Navigation
    background: Colors.appLight.background,
    card: Colors.appLight.cardPrimary,
    text: Colors.appLight.textPrimary,
    border: Colors.appLight.borderPrimary,
    primary: Colors.appLight.brand,

    // App-specific (custom)
    app: Colors.appLight,
  },
};

export const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,

    background: Colors.appDark.background,
    card: Colors.appDark.cardPrimary,
    text: Colors.appDark.textWhite,
    border: Colors.appDark.borderPrimary,
    primary: Colors.appDark.brand,

    app: Colors.appDark,
  },
};

export type AppColors = typeof Colors.appLight;

export type AppTheme = Theme & {
  colors: Theme["colors"] & {
    app: AppColors;
  };
};
