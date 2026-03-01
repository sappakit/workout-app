import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { LucideIcon } from "lucide-react-native";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonVariantStyles = {
  container: ViewStyle;
  text: TextStyle;
};

interface BaseButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  loading?: boolean;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: StyleProp<ViewStyle>;
  className?: string;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
}

type ButtonContent =
  | { title: string; icon?: LucideIcon }
  | { title?: string; icon: LucideIcon };

type ButtonProps = BaseButtonProps & ButtonContent;

export function AppButton({
  title,
  variant = "primary",
  loading,
  disabled,
  icon: Icon,
  iconSize = 16,
  iconColor,
  iconStyle,
  className,
  textClassName,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { colors } = useAppTheme();

  const isDisabled = disabled || loading;

  // Variant Styles
  const variantStyles: Record<ButtonVariant, ButtonVariantStyles> = {
    primary: {
      container: {
        backgroundColor: colors.app.brand,
      },
      text: {
        color: colors.app.textWhite,
      },
    },
    secondary: {
      container: {
        backgroundColor: colors.app.cardSecondary,
        borderColor: colors.app.borderSecondary,
        borderWidth: 1,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    tertiary: {
      container: {
        backgroundColor: colors.app.background,
        borderColor: colors.app.textAccent,
        borderWidth: 1,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.8}
      className={twMerge(
        clsx(
          isDisabled && "opacity-60",
          "h-12 flex-row items-center justify-center rounded-xl opacity-100",
          className,
        ),
      )}
      style={[currentVariant.container, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.text.color} />
      ) : (
        <>
          {Icon && (
            <Icon
              size={iconSize}
              color={currentVariant.text.color ?? iconColor}
              style={[title && { marginRight: 8 }, iconStyle]}
            />
          )}

          {title && (
            <ThemedText
              className={textClassName}
              style={[currentVariant.text, textStyle]}
            >
              {title}
            </ThemedText>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
