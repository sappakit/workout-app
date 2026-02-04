import { useAppTheme } from "@/hooks/useAppTheme";
import { Text, type TextProps } from "react-native";

type Variant =
  | "primary"
  | "secondary"
  | "accent"
  | "brand"
  | "success"
  | "warning"
  | "error";

type TextType = "default" | "defaultSemiBold" | "title" | "subtitle";

export type ThemedTextProps = TextProps & {
  type?: TextType;
  variant?: Variant;
  color?: string;
  className?: string;
};

const typeClassMap = {
  default: "text-base",
  defaultSemiBold: "text-base font-semibold",
  title: "text-3xl font-bold",
  subtitle: "text-xl font-bold",
} satisfies Record<TextType, string>;

export function ThemedText({
  className,
  type = "default",
  variant = "primary",
  color,
  style,
  ...rest
}: ThemedTextProps) {
  const { colors } = useAppTheme();

  const variantColorMap = {
    primary: colors.app.textPrimary,
    secondary: colors.app.textSecondary,
    accent: colors.app.textAccent,
    brand: colors.app.brand,
    success: colors.app.success,
    warning: colors.app.warning,
    error: colors.app.error,
  } satisfies Record<Variant, string>;

  const themedColor = color ?? variantColorMap[variant];

  const mergedClassName = `${typeClassMap[type]} ${className ?? ""}`.trim();

  return (
    <Text
      {...rest}
      className={mergedClassName}
      style={[{ color: themedColor }, style]}
    />
  );
}
