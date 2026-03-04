import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

export interface FormCheckboxProps extends PressableProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  error?: boolean;
  disabled?: boolean;
}

export default function FormCheckbox({
  value,
  onChange,
  label,
  error,
  disabled,
  className,
  ...props
}: FormCheckboxProps) {
  const { colors } = useAppTheme();

  const borderColor = error
    ? colors.app.error || "red"
    : value
      ? colors.app.brand
      : colors.app.borderPrimary;

  const backgroundColor = value ? colors.app.brand : colors.app.cardSecondary;

  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      className={twMerge(clsx("flex-row items-center", className))}
      {...props}
    >
      {/* Checkbox box */}
      <View
        className="h-5 w-5 items-center justify-center rounded border"
        style={{
          borderColor,
          backgroundColor,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {value && (
          <Check size={14} color={colors.app.textWhite} strokeWidth={3} />
        )}
      </View>

      {/* Label */}
      {label && (
        <ThemedText
          type="default"
          variant="primary"
          className="ml-3"
          style={{
            color: value ? colors.app.textAccent : colors.app.textPrimary,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}
