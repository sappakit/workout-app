import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { Input } from "@/components/ui/input";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { AppButton } from "../custom-ui/app-button";

type RNRInputProps = ComponentProps<typeof Input>;

export interface FormTextInputV2Props extends Omit<RNRInputProps, "className"> {
  /**
   * Controls the outer input container.
   */
  containerClassName?: string;

  /**
   * Controls the RNR Input itself.
   */
  inputClassName?: string;

  /**
   * Shows the destructive/error input state.
   */
  error?: boolean;

  /**
   * Optional leading semantic app icon.
   */
  icon?: AppIconName;

  /**
   * Shows a clear button when the input has a value.
   */
  clearable?: boolean;
}

export default function FormTextInputV2({
  containerClassName,
  inputClassName,
  error = false,
  icon,
  clearable = false,
  value,
  onChangeText,
  editable = true,
  placeholderTextColor,
  ...props
}: FormTextInputV2Props) {
  const colors = useAppColors();

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
      className={cn(
        "h-10 flex-row items-center gap-2 rounded-lg border bg-secondary px-3",
        error ? "border-destructive" : "border-input",
        editable === false && "opacity-50",
        containerClassName,
      )}
    >
      {icon ? (
        <AppIcon
          name={icon}
          variant="outline"
          size="sm"
          color={colors.mutedForeground}
        />
      ) : null}

      <Input
        {...props}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor={placeholderTextColor ?? colors.mutedForeground}
        className={cn(
          "h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm opacity-100 shadow-none",
          inputClassName,
        )}
      />

      {shouldShowClearButton ? (
        <AppButton
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          icon={{
            name: "close",
            size: "sm",
          }}
          onPress={handleClear}
        />
      ) : null}
    </View>
  );
}
