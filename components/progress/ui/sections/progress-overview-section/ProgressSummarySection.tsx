import {
  formatDurationShort,
  formatNumber,
} from "@/components/progress/model/progress-history.mapper";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { CalendarDays, Clock3, Layers3, TrendingUp } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";

type ProgressSummaryStatItem = {
  key: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  label: string;
};

interface ProgressSummarySectionProps {
  data: WorkoutProgressOverview["summary"];
}

export function ProgressSummarySection({ data }: ProgressSummarySectionProps) {
  const summaryStats: ProgressSummaryStatItem[] = [
    {
      key: "workouts",
      icon: CalendarDays,
      value: String(data.workoutsCompleted),
      label: "Workouts",
    },
    {
      key: "volume",
      icon: TrendingUp,
      value: `${formatNumber(data.totalVolumeKg)} kg`,
      label: "Volume",
    },
    {
      key: "sets",
      icon: Layers3,
      value: String(data.completedSets),
      label: "Sets",
    },
    {
      key: "time",
      icon: Clock3,
      value: formatDurationShort(data.totalDurationSeconds),
      label: "Time",
    },
  ];

  return (
    <FlatList
      data={summaryStats}
      keyExtractor={(item) => item.key}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperClassName="gap-3"
      contentContainerClassName="gap-3"
      renderItem={({ item }) => (
        <ProgressStatCard
          icon={item.icon}
          value={item.value}
          label={item.label}
        />
      )}
    />
  );
}

function ProgressStatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  label: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 flex-row items-center gap-3 rounded-2xl border p-3"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.app.cardSecondary }}
      >
        <Icon size={18} color={colors.app.brand} />
      </View>

      <View className="flex-1">
        <ThemedText
          type="default"
          variant="accent"
          className="text-xl font-semibold"
        >
          {value}
        </ThemedText>

        <ThemedText type="default" variant="primary" className="text-xs">
          {label}
        </ThemedText>
      </View>
    </View>
  );
}
