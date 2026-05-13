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
  View,
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
  const variantStyles = {
    primary: {
      containerClassName: undefined,
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
      textClassName: undefined,
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
      textClassName: undefined,
      container: {
        backgroundColor: colors.app.background,
        borderColor: colors.app.textAccent,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    option: {
      containerClassName: undefined,
      textClassName: undefined,
      container: {
        backgroundColor: colors.app.cardSecondary,
      },
      text: {
        color: colors.app.textPrimary,
      },
    },
    ghost: {
      containerClassName: undefined,
      textClassName: undefined,
      container: undefined,
      text: {
        color: colors.app.textPrimary,
      },
    },
  } satisfies Record<ButtonVariant, ButtonVariantStyles>;

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={twMerge(
        clsx(
          "h-12 flex-row items-center justify-center rounded-2xl",
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
        <ActivityIndicator color={iconColor ?? currentVariant.text.color} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {Icon && (
            <Icon
              size={iconSize}
              color={iconColor ?? currentVariant.text.color}
              style={iconStyle}
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
        </View>
      )}
    </TouchableOpacity>
  );
}
