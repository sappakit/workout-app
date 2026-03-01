import MainButton from "@/components/custom-ui/MainButton";
import { StatsGrid } from "@/components/custom-ui/StatGrid";
import { StreakCard } from "@/components/custom-ui/StreakCard";
import { WeekCalendar } from "@/components/custom-ui/WeekCalendar";
import { WorkoutCard } from "@/components/custom-ui/WorkoutCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { workoutData } from "@/data/workouts.mock";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppToast } from "@/lib/toast/useAppToast";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { signOut, loading } = useAuth();

  // TODO: remove
  const toast = useAppToast();

  // TODO: mock data
  const data = workoutData;

  return (
    <PageLayout>
      {/* TODO: remove */}
      <MainButton
        title="Log out"
        onPress={signOut}
        loading={loading}
        className="mb-4"
      />

      {/* TODO: remove */}
      <MainButton
        title="Toast"
        onPress={() =>
          toast.error({
            title: "Sign-up failed",
            message: "Something went wrong. Please try again.",
          })
        }
        loading={loading}
        className="mb-4"
      />

      {/* Streak Card */}
      <StreakCard />
      {/* Stats */}
      <View className="mt-3">
        <SectionHeader title="Your stats" />

        <View className="mt-2">
          <StatsGrid />
        </View>
      </View>
      {/* Calendar */}
      <View className="mt-3">
        <WeekCalendar onDateChange={(d) => console.log("Selected:", d)} />

        <View className="mt-2 flex-row items-center justify-between">
          <ChevronLeft size={24} color={colors.app.textSecondary} />

          <ThemedText
            type="default"
            variant="primary"
            style={{ color: colors.app.textAccent }}
          >
            November 2025
          </ThemedText>

          <ChevronRight size={24} color={colors.app.textSecondary} />
        </View>
      </View>
      {/* Today Plan */}
      <View className="mt-3">
        <SectionHeader title="Today plan" />

        <View className="mt-2">
          {data.map((workout) => (
            <WorkoutCard key={workout.id} data={workout} />
          ))}
        </View>
      </View>
    </PageLayout>
  );
}
