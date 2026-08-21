import { Button } from "@/components/ui/button";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { ActivityIndicator, View } from "react-native";
import type { AppIconSize } from "../app-icon/app-icon.styles";
import { AppIcon } from "../app-icon/AppIcon";
import { ThemedText } from "../themed-text";
import { buttonVariantConfigMap } from "./app-button.styles";
import type { AppButtonProps } from "./app-button.types";

const DEFAULT_ICON_SIZE: AppIconSize = "sm";

export function AppButton({
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  className,
  textClassName,
  ...props
}: AppButtonProps) {
  const colors = useAppColors();

  const isDisabled = disabled || loading;

  const variantConfig = buttonVariantConfigMap[variant];

  const containerClassName =
    "containerClassName" in variantConfig
      ? variantConfig.containerClassName
      : undefined;

  const variantTextClassName =
    "textClassName" in variantConfig ? variantConfig.textClassName : undefined;

  const contentColor = icon?.color ?? variantConfig.getContentColor(colors);

  const iconElement = icon ? (
    <AppIcon
      name={icon.name}
      variant={icon.variant ?? "filled"}
      size={icon.size ?? DEFAULT_ICON_SIZE}
      color={contentColor}
    />
  ) : null;

  const iconPosition = icon?.position ?? "left";

  return (
    <Button
      {...props}
      variant={variantConfig.buttonVariant}
      disabled={isDisabled}
      className={cn(containerClassName, className)}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {iconPosition === "left" && iconElement}

          {title ? (
            <ThemedText
              type="label"
              className={cn(variantTextClassName, textClassName)}
            >
              {title}
            </ThemedText>
          ) : null}

          {iconPosition === "right" && iconElement}
        </View>
      )}
    </Button>
  );
}
