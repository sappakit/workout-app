import { Button } from "@/components/ui/button";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import { ActivityIndicator, View } from "react-native";
import { AppIcon } from "../app-icon/AppIcon";
import type { AppIconSize } from "../app-icon/app-icon.types";
import { ThemedText } from "../themed-text";
import { buttonVariantConfigMap } from "./app-button.styles";
import type { AppButtonV2Props } from "./app-button.types";

const DEFAULT_ICON_SIZE: AppIconSize = "sm";

export function AppButtonV2({
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  className,
  textClassName,
  ...props
}: AppButtonV2Props) {
  const colors = useAppColors();

  const isDisabled = disabled || loading;
  const variantConfig = buttonVariantConfigMap[variant];

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
      className={cn(variantConfig.containerClassName, className)}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {iconPosition === "left" && iconElement}

          {title && (
            <ThemedText
              type="label"
              className={cn(variantConfig.textClassName, textClassName)}
            >
              {title}
            </ThemedText>
          )}

          {iconPosition === "right" && iconElement}
        </View>
      )}
    </Button>
  );
}
