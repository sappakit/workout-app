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
    containerClassName: "hover:bg-primary-hover active:bg-primary-hover",
    getContentColor: (colors) => colors.primaryForeground,
  },

  secondary: {
    buttonVariant: "secondary",
    containerClassName: "hover:bg-secondary-hover active:bg-secondary-hover",
    getContentColor: (colors) => colors.secondaryForeground,
  },

  contrast: {
    buttonVariant: "default",
    containerClassName:
      "bg-contrast hover:bg-contrast-hover active:bg-contrast-hover",
    textClassName: "text-contrast-foreground",
    getContentColor: (colors) => colors.contrastForeground,
  },

  outline: {
    buttonVariant: "outline",
    getContentColor: (colors) => colors.foreground,
  },

  destructive: {
    buttonVariant: "destructive",
    containerClassName:
      "hover:bg-destructive-hover active:bg-destructive-hover",
    getContentColor: (colors) => colors.destructiveForeground,
  },

  ghost: {
    buttonVariant: "ghost",
    getContentColor: (colors) => colors.foreground,
  },
};
