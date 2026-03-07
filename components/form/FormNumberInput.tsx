import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Separator } from "../custom-ui/Separator";

export interface FormNumberInputProps {
  value?: number;
  placeholder?: string;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function FormNumberInput({
  value,
  placeholder,
  onChange,
  min,
  max,
  step = 1,
  error,
  className,
  disabled,
}: FormNumberInputProps) {
  const { colors } = useAppTheme();

  const borderColor = error
    ? colors.app.error || "red"
    : colors.app.borderPrimary;

  const clamp = (num: number) => {
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
  };

  const handleTextChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");

    if (clean === "") {
      onChange?.(undefined);
      return;
    }

    const num = clamp(Number(clean));
    onChange?.(num);
  };

  const adjustValue = (change: number) => {
    if (disabled) return;

    const current = value ?? 0;
    const newValue = clamp(current + change);
    onChange?.(newValue);
  };

  return (
    <View
      className={twMerge(
        clsx("h-12 flex-row items-center rounded-lg border px-2", className),
      )}
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Input */}
      <TextInput
        value={value !== undefined ? String(value) : ""}
        placeholder={placeholder}
        keyboardType="numeric"
        onChangeText={handleTextChange}
        className="min-w-0 flex-1 px-2"
        placeholderTextColor={colors.app.textPrimary}
        style={{
          color: colors.app.textAccent,
        }}
        editable={!disabled}
      />

      <View className="flex-row items-center gap-2">
        {/* Minus */}
        <Pressable onPress={() => adjustValue(-step)} className="p-1">
          <Minus size={18} color={colors.app.textAccent} />
        </Pressable>

        {/* Divider */}
        <Separator className="h-6" />

        {/* Plus */}
        <Pressable onPress={() => adjustValue(+step)} className="p-1">
          <Plus size={18} color={colors.app.textAccent} />
        </Pressable>
      </View>
    </View>
  );
}
