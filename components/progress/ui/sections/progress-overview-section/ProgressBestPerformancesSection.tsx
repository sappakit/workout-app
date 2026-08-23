import { SectionHeader } from "@/components/layout/SectionHeader";
import { formatNumber } from "@/components/progress/model/progress-history.mapper";
import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import type { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { View } from "react-native";

interface ProgressBestPerformancesSectionProps {
  data: WorkoutProgressOverview["bestPerformances"];
}

export function ProgressBestPerformancesSection({
  data,
}: ProgressBestPerformancesSectionProps) {
  const hasBestPerformances = data.length > 0;

  return (
    <View className="gap-3">
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
                    icon: "volume",
                  },
                  {
                    label: "Volume",
                    value: `${formatNumber(record.bestSetVolumeKg)} kg`,
                    icon: "progress",
                  },
                  {
                    label: "Set",
                    value: record.bestSetLabel,
                    icon: "achievement",
                  },
                ],
              }}
            />
          ))}
        </View>
      ) : (
        <ContentFeedback
          icon="achievement"
          title="No best sets yet"
          subtitle="Log weight and reps to see your strongest sets."
        />
      )}
    </View>
  );
}

function formatCompletedDate(value: string | null) {
  if (!value) {
    return "Completed date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
