import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { LucideIcon } from "lucide-react-native";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "option" | "ghost";
type ButtonVariantStyles = {
  container?: ViewStyle;
  containerClassName?: string;
  text?: TextStyle;
  textClassName?: string;
};

interface BaseButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  loading?: boolean;
  iconSize?: number;
  iconColor?: ColorValue;
  iconStyle?: StyleProp<ViewStyle>;
  className?: string;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
}

type ButtonContent =
  | { title: string; icon?: LucideIcon }
  | { title?: string; icon: LucideIcon };

export type ButtonProps = BaseButtonProps & ButtonContent;

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
      textClassName: "font-medium",
      container: {
        backgroundColor: colors.app.brand,
      },
      text: {
        color: colors.app.textWhite,
      },
    },
    secondary: {
      containerClassName: "border",
      container: {
        backgroundColor: colors.app.cardSecondary,
        borderColor: colors.app.borderSecondary,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    tertiary: {
      containerClassName: "border",
      container: {
        backgroundColor: colors.app.background,
        borderColor: colors.app.textAccent,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    option: {
      container: {
        backgroundColor: colors.app.cardSecondary,
      },
      text: {
        color: colors.app.textPrimary,
      },
    },
    ghost: {
      text: {
        color: colors.app.textPrimary,
      },
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={twMerge(
        clsx(
          "h-12 flex-row items-center justify-center rounded-full opacity-100",
          currentVariant.containerClassName,
          className,
        ),
      )}
      style={[
        currentVariant.container,
        { opacity: isDisabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor ?? currentVariant?.text?.color} />
      ) : (
        <>
          {Icon && (
            <Icon
              size={iconSize}
              color={iconColor ?? currentVariant?.text?.color}
              style={[title && { marginRight: 8 }, iconStyle]}
            />
          )}

          {title && (
            <ThemedText
              className={twMerge(
                clsx(currentVariant.textClassName, textClassName),
              )}
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
