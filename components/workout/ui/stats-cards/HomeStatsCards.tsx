import { Dumbbell, LineChart, Timer } from "lucide-react-native";
import { View } from "react-native";
import { WorkoutStatsModel } from "../../model/workout-stats.mapper";
import { SimpleStatCard, VolumeStatCard } from "./StatCard";

interface HomeStatsCardsProps {
  data: WorkoutStatsModel;
}

export function HomeStatsCards({ data }: HomeStatsCardsProps) {
  return (
    <View className="flex-row gap-3">
      <VolumeStatCard
        value={data.totalVolumeText}
        volumeTrend={data.volumeTrend}
        icon={LineChart}
        className="flex-1"
      />

      <View className="flex-1 gap-3">
        <SimpleStatCard
          icon={Dumbbell}
          label="Workouts"
          value={data.workoutsCompletedText}
        />

        <SimpleStatCard
          icon={Timer}
          label="Time"
          value={data.totalDurationText}
        />
      </View>
    </View>
  );
}
