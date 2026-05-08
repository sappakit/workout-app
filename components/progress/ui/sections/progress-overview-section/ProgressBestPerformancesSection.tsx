import { formatNumber } from "@/components/progress/model/progress-history.mapper";
import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { Award } from "lucide-react-native";
import { View } from "react-native";

interface ProgressBestPerformancesSectionProps {
  data: WorkoutProgressOverview["bestPerformances"];
}

export function ProgressBestPerformancesSection({
  data,
}: ProgressBestPerformancesSectionProps) {
  return (
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
  );
}
