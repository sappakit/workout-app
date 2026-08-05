import { View } from "react-native";
import { WorkoutStatsModel } from "../../model/workout-stats.mapper";
import { SimpleStatCard, VolumeStatCard } from "./StatCard";

interface ProgressStatsCardsProps {
  data: WorkoutStatsModel;
}

export function ProgressStatsCards({ data }: ProgressStatsCardsProps) {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <SimpleStatCard
          icon="workout"
          label="Workouts"
          value={data.workoutsCompletedText}
          className="flex-1"
        />

        <SimpleStatCard
          icon="timer"
          label="Time"
          value={data.totalDurationText}
          className="flex-1"
        />
      </View>

      <View className="flex-row gap-3">
        <SimpleStatCard
          icon="sets"
          label="Sets"
          value={data.completedSetsText}
          className="flex-1"
        />

        <SimpleStatCard
          icon="reps"
          label="Reps"
          value={data.totalRepsText}
          className="flex-1"
        />
      </View>

      <VolumeStatCard
        label="Volume Trend"
        value={data.totalVolumeText}
        volumeTrend={data.volumeTrend}
        icon="progress"
        barMaxHeight={80}
        barWidth={24}
        className="min-h-52"
      />
    </View>
  );
}
