import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { TextInput as GestureHandlerTextInput } from "react-native-gesture-handler";
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
  inputClassName?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  allowDecimal?: boolean;
  showStepper?: boolean;
  inputMode?: "default" | "gesture"; // "gesture" for ReanimatedSwipeable compatibility
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
  inputClassName,
  style,
  disabled,
  allowDecimal = false,
  showStepper = true,
  inputMode = "default",
}: FormNumberInputProps) {
  const { colors } = useAppTheme();

  const InputComponent =
    inputMode === "gesture" ? GestureHandlerTextInput : RNTextInput;

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
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
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
    if (disabled) return;

    const current = value ?? 0;
    const newValue = clamp(current + change);

    setInputValue(String(newValue));
    onChange?.(newValue);
  };

  const handleTextChange = (text: string) => {
    const clean = sanitizeInput(text);

    setInputValue(clean);

    if (clean === "" || clean === ".") {
      onChange?.(null);
      return;
    }

    const num = allowDecimal ? Number(clean) : parseInt(clean, 10);

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

    const num = allowDecimal ? Number(inputValue) : parseInt(inputValue, 10);

    if (Number.isNaN(num)) {
      setInputValue("");
      onChange?.(null);
      return;
    }

    const clampedValue = clamp(num);

    setInputValue(String(clampedValue));
    onChange?.(clampedValue);
  };

  return (
    <View
      className={twMerge(
        clsx(
          "h-12 flex-row items-center justify-center rounded-lg px-2",
          className,
        ),
      )}
      style={[
        {
          backgroundColor: colors.app.cardSecondary,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <InputComponent
        className={twMerge(clsx("flex-1 text-center", inputClassName))}
        style={{
          color: colors.app.textAccent,
        }}
        value={inputValue}
        placeholder={placeholder}
        keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholderTextColor={colors.app.textPrimary}
        editable={!disabled}
        multiline={true}
        numberOfLines={1}
      />

      {showStepper && (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => adjustValue(-step)}
            className="p-1"
            disabled={disabled}
          >
            <Minus size={18} color={colors.app.textAccent} />
          </Pressable>

          <Separator className="h-6" />

          <Pressable
            onPress={() => adjustValue(+step)}
            className="p-1"
            disabled={disabled}
          >
            <Plus size={18} color={colors.app.textAccent} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
