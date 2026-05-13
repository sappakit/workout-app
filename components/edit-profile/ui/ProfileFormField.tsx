import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";

type ProfileFormFieldProps = {
  label: string;
  errorMessage?: string;
  children: React.ReactNode;
};

export function ProfileFormField({
  label,
  errorMessage,
  children,
}: ProfileFormFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <ThemedText type="default" variant="accent" className="mb-2">
        {label}
      </ThemedText>

      {children}

      {errorMessage && (
        <ThemedText
          type="default"
          variant="secondary"
          className="mt-2 text-sm"
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
