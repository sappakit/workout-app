import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable } from "react-native";

const TEXT_ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export type FormSelectTriggerTextAlign = keyof typeof TEXT_ALIGN_CLASS;

type FormSelectTriggerProps = {
  label: string;
  placeholder?: boolean;

  onPress: () => void;

  icon?: AppIconName;

  disabled?: boolean;
  error?: boolean;

  textAlign?: FormSelectTriggerTextAlign;

  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
};

export function FormSelectTrigger({
  label,
  placeholder = false,
  onPress,
  icon,
  disabled = false,
  error = false,
  textAlign = "left",
  className,
  textClassName,
  style,
}: FormSelectTriggerProps) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "h-10 flex-row items-center gap-2 rounded-lg border bg-secondary px-3 active:opacity-80",
        error ? "border-destructive" : "border-input",
        disabled && "opacity-50",
        className,
      )}
      style={style}
    >
      {icon ? (
        <AppIcon
          name={icon}
          variant="outline"
          size="sm"
          color={colors.mutedForeground}
        />
      ) : null}

      <ThemedText
        type="small"
        tone={placeholder ? "muted" : "default"}
        className={cn(
          "min-w-0 flex-1",
          TEXT_ALIGN_CLASS[textAlign],
          textClassName,
        )}
        numberOfLines={1}
      >
        {label}
      </ThemedText>

      <AppIcon name="chevron-down" size="sm" color={colors.mutedForeground} />
    </Pressable>
  );
}
