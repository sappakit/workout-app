import { SectionHeader } from "@/components/layout/SectionHeader";
import { formatNumber } from "@/components/progress/model/progress-history.mapper";
import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { ThemedText } from "@/components/themed-text";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { Award } from "lucide-react-native";
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
              key={record.exerciseName}
              columns={2}
              item={{
                id: record.exerciseName,
                title: record.exerciseName,
                subtitle: "Strength",
                icon: Award,
                list: [
                  {
                    label: "Weight",
                    value: `${formatNumber(record.bestWeightKg)} kg`,
                  },
                  {
                    label: "Volume",
                    value: `${formatNumber(record.bestSetVolumeKg)} kg`,
                  },
                  {
                    label: "Set",
                    value: record.bestSetLabel,
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
