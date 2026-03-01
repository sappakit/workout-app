import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { ThemedText } from "../themed-text";

interface MainButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  textStyle?: TextStyle;
  icon?: ReactNode;
  className?: string;
}

export default function MainButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
  icon,
  className,
  ...props
}: MainButtonProps) {
  const { colors } = useAppTheme();

  const isDisabled = disabled || loading;
  const showIcon = icon && !loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={twMerge(
        clsx(
          "h-12 flex-row items-center justify-center rounded-xl opacity-100",
          isDisabled && "opacity-60",
          className,
        ),
      )}
      style={[{ backgroundColor: colors.app.brand }, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.app.textWhite} />
      ) : (
        <>
          {showIcon && icon}

          <ThemedText
            type="default"
            variant="primary"
            className="font-medium"
            style={[{ color: colors.app.textWhite }, textStyle]}
          >
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}
