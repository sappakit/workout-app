import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 items-center justify-center rounded-2xl border px-3 py-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <ThemedText
        type="subtitle"
        variant="primary"
        className="font-bold"
        style={{
          color: colors.app.textAccent,
        }}
      >
        {value}
      </ThemedText>

      <ThemedText
        type="default"
        variant="secondary"
        className="mt-1 text-xs"
        style={{
          color: colors.app.textPrimary,
        }}
      >
        {label}
      </ThemedText>
    </View>
  );
}
