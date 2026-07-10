import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays } from "lucide-react-native";
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
  const { colors } = useAppTheme();

  return (
    <View
      className="gap-4 rounded-3xl p-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.app.brand }}
        >
          <LinearGradient
            colors={[
              colors.app.brandLight,
              colors.app.brand,
              colors.app.brandDark,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View>
            <CalendarDays size={20} color={colors.app.textWhite} />
          </View>
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
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 rounded-2xl p-3"
      style={{
        backgroundColor: colors.app.cardSecondary,
      }}
    >
      <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
        {label}
      </ThemedText>

      <ThemedText type="title" variant="accent">
        {value}
      </ThemedText>
    </View>
  );
}
