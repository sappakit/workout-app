import { SectionHeader } from "@/components/layout/SectionHeader";
import { formatNumber } from "@/components/progress/model/progress-history.mapper";
import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { ThemedText } from "@/components/themed-text";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { Dumbbell, Trophy, Weight } from "lucide-react-native";
import { View } from "react-native";

interface ProgressBestPerformancesSectionProps {
  data: WorkoutProgressOverview["bestPerformances"];
}

export function ProgressBestPerformancesSection({
  data,
}: ProgressBestPerformancesSectionProps) {
  const hasBestPerformances = data.length > 0;

  return (
    <>
      <SectionHeader
        title="Best Performances"
        subtitle={
          hasBestPerformances
            ? "Your strongest completed sets this week"
            : undefined
        }
      />

      {hasBestPerformances ? (
        <View className="gap-3">
          {data.map((record) => (
            <ProgressMetricCard
              key={record.exerciseId}
              columns={2}
              item={{
                id: record.exerciseId,
                title: record.exerciseName,
                subtitle: formatCompletedDate(record.setCompletedAt),
                imageUrl: record.exerciseImageUrl,
                list: [
                  {
                    label: "Weight",
                    value: `${formatNumber(record.bestWeightKg)} kg`,
                    icon: Dumbbell,
                  },
                  {
                    label: "Volume",
                    value: `${formatNumber(record.bestSetVolumeKg)} kg`,
                    icon: Weight,
                  },
                  {
                    label: "Set",
                    value: record.bestSetLabel,
                    icon: Trophy,
                  },
                ],
              }}
            />
          ))}
        </View>
      ) : (
        <View>
          <ThemedText type="default" variant="accent">
            No best sets yet
          </ThemedText>

          <ThemedText type="default" variant="primary">
            Log weight and reps to see your strongest sets.
          </ThemedText>
        </View>
      )}
    </>
  );
}

function formatCompletedDate(value: string | null) {
  if (!value) return "Completed date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
