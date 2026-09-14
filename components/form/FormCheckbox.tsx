import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import {
  ThemedText,
  type ThemedTextTone,
} from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import type { PressableProps } from "react-native";
import { Pressable, View } from "react-native";

const checkboxSizeClassMap = {
  sm: {
    box: "h-5 w-5 rounded-sm",
    indicator: "h-2.5 w-2.5",
    label: "ml-2",
  },
  md: {
    box: "h-6 w-6 rounded-md",
    indicator: "h-3 w-3",
    label: "ml-3",
  },
  lg: {
    box: "h-7 w-7 rounded-md",
    indicator: "h-3.5 w-3.5",
    label: "ml-3",
  },
} as const;

const checkboxIconSizeMap = {
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const checkboxTextTypeMap = {
  sm: "small",
  md: "body",
  lg: "bodyStrong",
} as const;

export type FormCheckboxSize = keyof typeof checkboxSizeClassMap;

export interface FormCheckboxProps extends Omit<
  PressableProps,
  "onPress" | "children"
> {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  labelTone?: ThemedTextTone;
  error?: boolean;
  disabled?: boolean;
  selectionMode?: "multiple" | "single";
  size?: FormCheckboxSize;
}

export default function FormCheckbox({
  value,
  onChange,
  label,
  labelTone,
  error = false,
  disabled = false,
  selectionMode = "multiple",
  size = "md",
  className,
  ...props
}: FormCheckboxProps) {
  const colors = useAppColors();

  const isSingle = selectionMode === "single";
  const sizeClasses = checkboxSizeClassMap[size];

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
          "items-center justify-center border",
          sizeClasses.box,
          isSingle && "rounded-full",
          value ? "border-primary bg-primary" : "border-border bg-card",
          error && "border-destructive",
        )}
      >
        {value ? (
          isSingle ? (
            <View
              className={cn(
                "rounded-full bg-primary-foreground",
                sizeClasses.indicator,
              )}
            />
          ) : (
            <AppIcon
              name="check"
              size={checkboxIconSizeMap[size]}
              color={colors.primaryForeground}
            />
          )
        ) : null}
      </View>

      {label ? (
        <ThemedText
          type={checkboxTextTypeMap[size]}
          tone={labelTone}
          className={sizeClasses.label}
        >
          {label}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}
