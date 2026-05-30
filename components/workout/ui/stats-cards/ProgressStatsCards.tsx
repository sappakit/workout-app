import { ChartBar, Dumbbell, Layers, Timer, Weight } from "lucide-react-native";
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
          icon={Weight}
          label="Volume"
          value={data.totalVolumeText}
          className="flex-1"
        />

        <SimpleStatCard
          icon={Dumbbell}
          label="Workouts"
          value={data.workoutsCompletedText}
          className="flex-1"
        />
      </View>

      <View className="flex-row gap-3">
        <SimpleStatCard
          icon={Layers}
          label="Sets"
          value={data.completedSetsText}
          className="flex-1"
        />

        <SimpleStatCard
          icon={Timer}
          label="Time"
          value={data.totalDurationText}
          className="flex-1"
        />
      </View>

      <VolumeStatCard
        label={"Volume Trend"}
        value={data.totalVolumeText}
        volumeTrend={data.volumeTrend}
        icon={ChartBar}
        barMaxHeight={80}
        barWidth={24}
      />
    </View>
  );
}
