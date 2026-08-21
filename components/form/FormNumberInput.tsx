import { AppButton } from "@/components/custom-ui/app-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import { TextInput as GestureHandlerTextInput } from "react-native-gesture-handler";

export interface FormNumberInputProps {
  value?: number | null;
  placeholder?: string;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;

  /**
   * Controls the outer number input container.
   */
  containerClassName?: string;

  /**
   * Controls the text input itself.
   */
  inputClassName?: string;

  /**
   * Controls inline styles for the outer container.
   */
  containerStyle?: StyleProp<ViewStyle>;

  disabled?: boolean;
  allowDecimal?: boolean;
  showStepper?: boolean;

  /**
   * Use "gesture" when rendered inside ReanimatedSwipeable.
   */
  inputMode?: "default" | "gesture";
}

export default function FormNumberInput({
  value,
  placeholder,
  onChange,
  min,
  max,
  step = 1,
  error = false,
  containerClassName,
  inputClassName,
  containerStyle,
  disabled = false,
  allowDecimal = false,
  showStepper = true,
  inputMode = "default",
}: FormNumberInputProps) {
  const colors = useAppColors();

  const [inputValue, setInputValue] = useState(
    value != null ? String(value) : "",
  );

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value != null ? String(value) : "");
    }
  }, [value, isFocused]);

  const clamp = (num: number) => {
    if (min !== undefined && num < min) {
      return min;
    }

    if (max !== undefined && num > max) {
      return max;
    }

    return num;
  };

  const sanitizeInput = (text: string) => {
    let clean = allowDecimal
      ? text.replace(/[^0-9.]/g, "")
      : text.replace(/[^0-9]/g, "");

    if (allowDecimal) {
      const parts = clean.split(".");

      if (parts.length > 2) {
        clean = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    return clean;
  };

  const adjustValue = (change: number) => {
    if (disabled) {
      return;
    }

    const current = value ?? 0;
    const nextValue = clamp(current + change);

    setInputValue(String(nextValue));
    onChange?.(nextValue);
  };

  const handleTextChange = (text: string) => {
    const clean = sanitizeInput(text);

    setInputValue(clean);

    if (clean === "" || clean === ".") {
      onChange?.(null);
      return;
    }

    const numberValue = allowDecimal ? Number(clean) : parseInt(clean, 10);

    if (!Number.isNaN(numberValue)) {
      onChange?.(clamp(numberValue));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (inputValue === "" || inputValue === ".") {
      setInputValue("");
      onChange?.(null);
      return;
    }

    const numberValue = allowDecimal
      ? Number(inputValue)
      : parseInt(inputValue, 10);

    if (Number.isNaN(numberValue)) {
      setInputValue("");
      onChange?.(null);
      return;
    }

    const clampedValue = clamp(numberValue);

    setInputValue(String(clampedValue));
    onChange?.(clampedValue);
  };

  return (
    <View
      className={cn(
        "h-10 flex-row items-center rounded-lg border bg-secondary px-2",
        error ? "border-destructive" : "border-input",
        disabled && "opacity-50",
        containerClassName,
      )}
      style={containerStyle}
    >
      {inputMode === "gesture" ? (
        <GestureHandlerTextInput
          className={cn(
            "min-w-0 flex-1 text-center text-sm text-foreground",
            inputClassName,
          )}
          value={inputValue}
          placeholder={placeholder}
          keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={colors.mutedForeground}
          editable={!disabled}
          multiline={true}
          numberOfLines={1}
        />
      ) : (
        <Input
          className={cn(
            "h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-center text-sm opacity-100 shadow-none",
            inputClassName,
          )}
          value={inputValue}
          placeholder={placeholder}
          keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={colors.mutedForeground}
          editable={!disabled}
        />
      )}

      {showStepper ? (
        <View className="flex-row items-center gap-1">
          <AppButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            icon={{
              name: "remove",
              size: "sm",
            }}
            disabled={disabled}
            onPress={() => adjustValue(-step)}
          />

          <Separator orientation="vertical" className="h-6" />

          <AppButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            icon={{
              name: "add",
              size: "sm",
            }}
            disabled={disabled}
            onPress={() => adjustValue(step)}
          />
        </View>
      ) : null}
    </View>
  );
}
