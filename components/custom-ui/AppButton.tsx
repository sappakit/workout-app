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

type ButtonShape = "square" | "rounded" | "pill";
const buttonShapeClassMap = {
  square: "rounded-none",
  rounded: "rounded-xl",
  pill: "rounded-full",
} satisfies Record<ButtonShape, string>;

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "destructive"
  | "option"
  | "ghost"
  | "white";

type ButtonVariantStyles = {
  container?: ViewStyle;
  containerClassName?: string;
  text?: TextStyle;
  textClassName?: string;
};

interface BaseButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  shape?: ButtonShape;
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
  shape = "rounded",
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
        backgroundColor: colors.app.buttonBgPrimary,
      },
      text: {
        color: colors.app.textWhite,
      },
    },
    secondary: {
      containerClassName: undefined,
      textClassName: undefined,
      container: {
        backgroundColor: colors.app.buttonBgSecondary,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    tertiary: {
      containerClassName: undefined,
      textClassName: undefined,
      container: {
        backgroundColor: colors.app.buttonBgTertiary,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    outline: {
      containerClassName: "border",
      textClassName: "font-medium",
      container: {
        borderColor: colors.app.borderPrimary,
      },
      text: {
        color: colors.app.textAccent,
      },
    },
    destructive: {
      containerClassName: undefined,
      textClassName: "font-medium",
      container: {
        backgroundColor: colors.app.error,
      },
      text: {
        color: colors.app.textWhite,
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
      containerClassName: "h-fit",
      textClassName: undefined,
      container: undefined,
      text: {
        color: colors.app.textPrimary,
      },
    },
    white: {
      containerClassName: undefined,
      textClassName: "font-medium",
      container: {
        backgroundColor: colors.app.white,
      },
      text: {
        color: colors.app.textBlack,
      },
    },
  } satisfies Record<ButtonVariant, ButtonVariantStyles>;

  const currentVariant = variantStyles[variant];
  const currentShape = buttonShapeClassMap[shape];

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={twMerge(
        clsx(
          "h-12 flex-row items-center justify-center",
          currentVariant.containerClassName,
          currentShape,
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
              type="small"
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
