import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { FormTextInputProps } from "./FormTextInput";

export default function FormPasswordInput({
  style,
  error,
  placeholderTextColor,
  className,
  ...props
}: FormTextInputProps) {
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative justify-center">
      <TextInput
        {...props}
        secureTextEntry={!showPassword}
        className={twMerge(
          clsx("h-12 rounded-lg border px-4 py-3 pr-12 text-sm", className),
        )}
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
      />

      <TouchableOpacity
        className="absolute right-3 h-full items-center justify-center"
        onPress={() => setShowPassword((prev) => !prev)}
        activeOpacity={0.7}
        hitSlop={8}
      >
        {showPassword ? (
          <Eye size={18} color={colors.app.textPrimary} />
        ) : (
          <EyeOff size={18} color={colors.app.textPrimary} />
        )}
      </TouchableOpacity>
    </View>
  );
}
