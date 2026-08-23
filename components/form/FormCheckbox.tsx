import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import type { PressableProps } from "react-native";
import { Pressable, View } from "react-native";

export interface FormCheckboxProps extends Omit<
  PressableProps,
  "onPress" | "children"
> {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  selectionMode?: "multiple" | "single";
}

export default function FormCheckbox({
  value,
  onChange,
  label,
  error = false,
  disabled = false,
  selectionMode = "multiple",
  className,
  ...props
}: FormCheckboxProps) {
  const colors = useAppColors();

  const isMultiple = selectionMode === "multiple";

  return (
    <Pressable
      {...props}
      onPress={() => onChange(!value)}
      disabled={disabled}
      className={cn(
        "flex-row items-center active:opacity-80",
        disabled && "opacity-50",
        className,
      )}
    >
      <View
        className={cn(
          "h-6 w-6 items-center justify-center border",
          isMultiple ? "rounded-md" : "rounded-full",
          value ? "border-primary bg-primary" : "border-border bg-card",
          error && "border-destructive",
        )}
      >
        {value ? (
          isMultiple ? (
            <AppIcon name="check" size="xs" color={colors.primaryForeground} />
          ) : (
            <View className="h-2 w-2 rounded-full bg-primary-foreground" />
          )
        ) : null}
      </View>

      {label ? (
        <ThemedText type="body" className="ml-3">
          {label}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}
