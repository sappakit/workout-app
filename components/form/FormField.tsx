import { ThemedText } from "@/components/custom-ui/themed-text";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

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
  return (
    <View className={cn("gap-2", className)} style={style}>
      <ThemedText type="label">{label}</ThemedText>

      {children}

      <FormErrorMessage message={errorMessage} />
    </View>
  );
}

type FormErrorMessageProps = {
  message?: string;
  className?: string;
};

export function FormErrorMessage({
  message,
  className,
}: FormErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <ThemedText type="small" tone="destructive" className={className}>
      {message}
    </ThemedText>
  );
}
