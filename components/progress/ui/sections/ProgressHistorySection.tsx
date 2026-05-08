import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import { ProgressMetricCardItem } from "../elements/ProgressMetricCard";

interface ProgressHistorySectionProps {
  data: ProgressMetricCardItem[];
}

// TODO: add infinite scrolling
export function ProgressHistorySection({ data }: ProgressHistorySectionProps) {
  return (
    <>
      <View>
        <ThemedText type="title" variant="accent">
          Recent Workouts
        </ThemedText>

        <ThemedText type="default" variant="primary" className="text-sm">
          Your completed workout history
        </ThemedText>
      </View>

      <View className="gap-3">
        {data.map((item) => (
          <ProgressMetricCard key={item.id} item={item} />
        ))}
      </View>
    </>
  );
}
