import { AppButton } from "@/components/custom-ui/AppButton";
import { StatsGrid } from "@/components/custom-ui/StatGrid";
import { StreakCard } from "@/components/custom-ui/StreakCard";
import { WeekCalendar } from "@/components/custom-ui/WeekCalendar";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { ExerciseCardReadonly } from "@/components/workout/ui/exercise-card/ExerciseCardReadonly";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AuthStorage } from "@/lib/api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import * as Clipboard from "expo-clipboard";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";
import { workoutApi } from "../api/workout.api";

export default function HomeScreen() {
  const { colors } = useAppTheme();

  const invalidateQueries = useInvalidateQueries();

  // TODO: remove
  const toast = useAppToast();

  // Today workout data
  const url = workoutApi.getSchedule();

  const { data, isLoading, isError, isSuccess, isFetching } =
    useGetQuery<WorkoutSchedule>(workoutQueryKeys.schedule, url);

  const handleRefresh = async () => {
    await invalidateQueries([workoutQueryKeys.schedule]);
  };

  // TODO: add loading/error
  if (isLoading) return null;
  if (isError || !data) return null;

  return (
    <PageLayout
      headerProps={{
        variant: "home",
        userName: "Tae",
      }}
      pullToRefresh={{ refreshing: isFetching, onRefresh: handleRefresh }}
    >
      {/* TODO: remove */}
      <AppButton
        title="Toast"
        variant="primary"
        textClassName="font-medium"
        onPress={() =>
          toast.error({
            title: "Sign-up failed",
            message: "Something went wrong. Please try again.",
          })
        }
        className="mb-4"
      />

      {/* TODO: remove */}
      <AppButton
        title="Get access token"
        variant="primary"
        textClassName="font-medium"
        onPress={async () => {
          const token = await AuthStorage.getAccessToken();

          if (token) {
            await Clipboard.setStringAsync(token);
            console.log("Token copied");
          }
        }}
        className="mb-4"
      />

      {/* Streak Card */}
      <StreakCard />

      {/* Stats */}
      <View className="mt-4">
        <SectionHeader title="Your stats" />

        <View className="mt-2">
          <StatsGrid />
        </View>
      </View>

      {/* Calendar */}
      <View className="mt-4">
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
      <View className="mt-4">
        <SectionHeader title="Today plan" />

        {data.workout.workoutExercises.map((item) => (
          <ExerciseCardReadonly key={item.id} data={item} className="mt-2" />
        ))}
      </View>
    </PageLayout>
  );
}
