import { ThemedText } from "@/components/custom-ui/themed-text";
import { View } from "react-native";

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View className="flex-1 items-center justify-center rounded-2xl bg-card px-3 py-4">
      <ThemedText type="heading" className="text-center">
        {value}
      </ThemedText>

      <ThemedText type="caption" tone="muted" className="mt-1 text-center">
        {label}
      </ThemedText>
    </View>
  );
}
