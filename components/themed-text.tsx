import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Text, type TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

type TextType = "default" | "defaultSemiBold" | "title" | "subtitle";

type Variant =
  | "primary"
  | "secondary"
  | "accent"
  | "brand"
  | "success"
  | "warning"
  | "error";

export type ThemedTextProps = TextProps & {
  type?: TextType;
  variant?: Variant;
  color?: string;
  className?: string;
};

const typeClassMap = {
  default: "",
  defaultSemiBold: "font-semibold",
  title: "text-3xl font-semibold",
  subtitle: "text-xl font-semibold",
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

  return (
    <Text
      {...rest}
      className={twMerge(clsx(typeClassMap[type], className))}
      style={[{ color: themedColor }, style]}
    />
  );
}
