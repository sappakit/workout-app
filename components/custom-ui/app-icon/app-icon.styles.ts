export const appIconSizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const satisfies Record<string, number>;

export type AppIconSize = keyof typeof appIconSizeMap;
