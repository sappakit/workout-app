import type { AppIconSize } from "./app-icon.types";

export const appIconSizeMap = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} satisfies Record<AppIconSize, number>;
