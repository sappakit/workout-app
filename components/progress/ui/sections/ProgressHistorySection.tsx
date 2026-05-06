import { ProgressPageData } from "@/components/progress/ProgressContent";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { BicepsFlexed } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";

interface ProgressHistorySectionProps {
  recentWorkouts: ProgressPageData["recentWorkouts"];
}

export function ProgressHistorySection({
  recentWorkouts,
}: ProgressHistorySectionProps) {

  
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
        {recentWorkouts.map((workout) => (
          <RecentWorkoutCard key={workout.id} workout={workout} />
        ))}
      </View>
    </>
  );
}

function RecentWorkoutCard({
  workout,
}: {
  workout: ProgressPageData["recentWorkouts"][number];
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="gap-2 rounded-2xl border p-2"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.app.cardSecondary }}
        >
          <BicepsFlexed size={20} color={colors.app.brand} />
        </View>

        <View className="flex-1">
          <ThemedText type="default" variant="accent" className="text-xs">
            Strength Programs
          </ThemedText>

          <ThemedText type="defaultSemiBold" variant="brand">
            {workout.workoutName}
          </ThemedText>
        </View>

        <ThemedText
          type="defaultSemiBold"
          className="self-start p-1 text-xs"
          style={{ color: colors.app.textPrimary }}
        >
          {formatDate(workout.completedAt)}
        </ThemedText>
      </View>

      <WorkoutMetricsList workout={workout} />
    </View>
  );
}

type WorkoutMetricItem = {
  key: string;
  label: string;
  value: string;
};

function WorkoutMetricsList({
  workout,
}: {
  workout: ProgressPageData["recentWorkouts"][number];
}) {
  const metrics: WorkoutMetricItem[] = [
    {
      key: "duration",
      label: "Duration",
      value: formatDurationShort(workout.durationSeconds),
    },
    {
      key: "volume",
      label: "Volume",
      value: `${formatNumber(workout.volumeKg)} kg`,
    },
  ];

  return (
    <FlatList
      data={metrics}
      keyExtractor={(item) => item.key}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperClassName="gap-2"
      contentContainerClassName="gap-2"
      renderItem={({ item }) => (
        <MiniMetric label={item.label} value={item.value} />
      )}
    />
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 rounded-xl px-3 py-2"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>

      <ThemedText type="default" variant="accent">
        {value}
      </ThemedText>
    </View>
  );
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US").format(value);
}

function formatDurationShort(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
