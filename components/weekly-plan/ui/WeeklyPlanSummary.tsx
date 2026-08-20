import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useAppColors } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

interface WeeklyPlanSummaryProps {
  assignedWorkoutCount: number;
  restDayCount: number;
  unassignedDayCount: number;
}

export function WeeklyPlanSummary({
  assignedWorkoutCount,
  restDayCount,
  unassignedDayCount,
}: WeeklyPlanSummaryProps) {
  const colors = useAppColors();

  return (
    <View className="gap-4 rounded-3xl bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary">
          <LinearGradient
            colors={[colors.primary, colors.primaryHover]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={StyleSheet.absoluteFillObject}
          />

          <AppIcon
            name="weekly-plan"
            variant="outline"
            size="md"
            color={colors.primaryForeground}
          />
        </View>

        <View className="flex-1">
          <SectionHeader
            title="Build your weekly routine"
            subtitle="Plan your training from Monday to Sunday"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <SummaryStatCard label="Workout days" value={assignedWorkoutCount} />

        <SummaryStatCard label="Rest days" value={restDayCount} />

        <SummaryStatCard label="Unassigned" value={unassignedDayCount} />
      </View>
    </View>
  );
}

interface SummaryStatCardProps {
  label: string;
  value: number;
}

function SummaryStatCard({ label, value }: SummaryStatCardProps) {
  return (
    <View className="flex-1 rounded-2xl bg-secondary p-3">
      <ThemedText type="caption" tone="muted" numberOfLines={1}>
        {label}
      </ThemedText>

      <ThemedText type="title">{value}</ThemedText>
    </View>
  );
}
