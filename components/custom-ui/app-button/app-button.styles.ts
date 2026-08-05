import { Button } from "@/components/ui/button";
import type { SemanticTheme } from "@/lib/theme";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import type { AppButtonV2Variant } from "./app-button.types";

type ReusableButtonVariant = NonNullable<
  ComponentProps<typeof Button>["variant"]
>;

type AppButtonVariantConfig = {
  buttonVariant: ReusableButtonVariant;
  containerClassName?: string;
  textClassName?: string;
  getContentColor: (colors: SemanticTheme) => ColorValue;
};

export const buttonVariantConfigMap: Record<
  AppButtonV2Variant,
  AppButtonVariantConfig
> = {
  primary: {
    buttonVariant: "default",
    getContentColor: (colors) => colors.primaryForeground,
  },

  secondary: {
    buttonVariant: "secondary",
    getContentColor: (colors) => colors.secondaryForeground,
  },

  contrast: {
    buttonVariant: "ghost",
    containerClassName: "bg-accent active:opacity-90",
    textClassName: "text-accent-foreground",
    getContentColor: (colors) => colors.accentForeground,
  },

  outline: {
    buttonVariant: "outline",
    getContentColor: (colors) => colors.foreground,
  },

  destructive: {
    buttonVariant: "destructive",
    getContentColor: (colors) => colors.destructiveForeground,
  },

  ghost: {
    buttonVariant: "ghost",
    getContentColor: (colors) => colors.foreground,
  },
};
