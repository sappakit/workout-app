import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { LucideIcon, X } from "lucide-react-native";
import React from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { twMerge } from "tailwind-merge";

export interface FormTextInputProps extends TextInputProps {
  className?: string;
  inputClassName?: string;
  error?: boolean;
  icon?: LucideIcon;
  clearable?: boolean;
}

export default function FormTextInput({
  className,
  inputClassName,
  error,
  icon: Icon,
  placeholderTextColor,
  style,
  clearable = false,
  value,
  onChangeText,
  editable = true,
  ...props
}: FormTextInputProps) {
  const { colors } = useAppTheme();

  const shouldShowClearButton =
    clearable &&
    editable !== false &&
    typeof value === "string" &&
    value.length > 0;

  const handleClear = () => {
    onChangeText?.("");
  };

  return (
    <View
      className={twMerge(
        clsx(
          "h-12 flex-row items-center gap-2 rounded-lg border px-4",
          className,
        ),
      )}
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: error
          ? colors.app.error || "red"
          : colors.app.borderPrimary,
      }}
    >
      {Icon && <Icon size={18} color={colors.app.textPrimary} />}

      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        className={twMerge(clsx("min-w-0 flex-1 text-sm", inputClassName))}
        style={[{ color: colors.app.textAccent }, style]}
        placeholderTextColor={placeholderTextColor ?? colors.app.textPrimary}
      />

      {shouldShowClearButton && (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={10}
          className="items-center justify-center"
          onPress={handleClear}
        >
          <X size={18} color={colors.app.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
