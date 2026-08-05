import type { AppTextTone, AppTextType } from "./themed-text.types";

export const textTypeClassMap = {
  display: "text-3xl font-bold leading-9",
  title: "text-2xl font-bold leading-8",
  heading: "text-lg font-semibold leading-6",
  body: "text-base font-normal leading-6",
  bodyStrong: "text-base font-semibold leading-6",
  label: "text-sm font-semibold leading-5",
  small: "text-sm font-normal leading-5",
  caption: "text-xs font-normal leading-4",
} satisfies Record<AppTextType, string>;

export const textToneClassMap = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-muted-foreground opacity-70",
  primary: "text-primary",
  contrast: "text-accent",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} satisfies Record<AppTextTone, string>;
