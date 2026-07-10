import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  errorMessage?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function FormField({
  label,
  children,
  errorMessage,
  className,
  style,
}: FormFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View className={twMerge(clsx("gap-2", className))} style={style}>
      <ThemedText type="default" variant="accent">
        {label}
      </ThemedText>

      {children}

      {!!errorMessage && (
        <ThemedText
          type="small"
          style={{
            color: colors.app.error ?? "red",
          }}
        >
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
}
