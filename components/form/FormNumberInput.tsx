import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, StyleProp, TextInput, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { Separator } from "../custom-ui/Separator";

export interface FormNumberInputProps {
  value?: number | null;
  placeholder?: string;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  keyboardType?: "numeric" | "decimal-pad";
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
  style,
  disabled,
  keyboardType = "numeric",
}: FormNumberInputProps) {
  const { colors } = useAppTheme();
  const [inputValue, setInputValue] = useState(
    value != null ? String(value) : "",
  );
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.app.error || "red"
    : colors.app.borderPrimary;

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value != null ? String(value) : "");
    }
  }, [value, isFocused]);

  const clamp = (num: number) => {
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
  };

  const handleTextChange = (text: string) => {
    let clean = text.replace(/[^0-9.]/g, "");

    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    setInputValue(clean);

    const num = Number(clean);

    if (!Number.isNaN(num)) {
      onChange?.(clamp(num));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (inputValue === "" || inputValue === ".") {
      setInputValue("");
      onChange?.(null);
      return;
    }

    if (inputValue.endsWith(".")) {
      const normalized = String(value ?? "");
      setInputValue(normalized);
    }
  };

  const adjustValue = (change: number) => {
    if (disabled) return;

    const current = value ?? 0;
    const newValue = clamp(current + change);

    setInputValue(String(newValue));
    onChange?.(newValue);
  };

  return (
    <View
      className={twMerge(
        clsx("h-12 flex-row items-center rounded-lg border px-2", className),
      )}
      style={[
        {
          backgroundColor: colors.app.cardSecondary,
          borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <TextInput
        value={inputValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="min-w-0 flex-1 px-2"
        placeholderTextColor={colors.app.textPrimary}
        style={{
          color: colors.app.textAccent,
        }}
        editable={!disabled}
      />

      <View className="flex-row items-center gap-2">
        <Pressable onPress={() => adjustValue(-step)} className="p-1">
          <Minus size={18} color={colors.app.textAccent} />
        </Pressable>

        <Separator className="h-6" />

        <Pressable onPress={() => adjustValue(+step)} className="p-1">
          <Plus size={18} color={colors.app.textAccent} />
        </Pressable>
      </View>
    </View>
  );
}
