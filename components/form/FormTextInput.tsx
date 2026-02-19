import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

export interface FormTextInputProps extends TextInputProps {
  error?: boolean;
}

export default function FormTextInput({
  className,
  error,
  placeholderTextColor,
  style,
  ...props
}: FormTextInputProps) {
  const { colors } = useAppTheme();

  return (
    <TextInput
      className={`h-12 rounded-lg border px-4 py-3 text-sm ${className}`.trim()}
      style={[
        {
          color: colors.app.textAccent,
          backgroundColor: colors.app.cardSecondary,
          borderColor: error
            ? colors.app.error || "red"
            : colors.app.borderPrimary,
        },
        style,
      ]}
      placeholderTextColor={placeholderTextColor ?? colors.app.textPrimary}
      {...props}
    />
  );
}
