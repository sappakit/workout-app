import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  getProgressOverviewDateLabel,
  getProgressOverviewTitle,
} from "@/components/progress/model/progress-overview.mapper";
import { mapProgressOverviewToWorkoutStats } from "@/components/workout/model/workout-stats.mapper";
import { ProgressStatsCards } from "@/components/workout/ui/stats-cards/ProgressStatsCards";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { View } from "react-native";
import { ProgressBestPerformancesSection } from "./ProgressBestPerformancesSection";

interface ProgressOverviewSectionProps {
  data: WorkoutProgressOverview;
}

export function ProgressOverviewSection({
  data,
}: ProgressOverviewSectionProps) {
  const workoutStats = mapProgressOverviewToWorkoutStats(data);

  return (
    <View className="gap-3 p-4">
      <SectionHeader
        title={getProgressOverviewTitle(data.type)}
        subtitle={getProgressOverviewDateLabel({
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
        })}
      />

      <ProgressStatsCards data={workoutStats} />

      <ProgressBestPerformancesSection data={data.bestPerformances} />
    </View>
  );
}
