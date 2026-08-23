import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WeeklyPlanSkeleton } from "@/components/weekly-plan/ui/WeeklyPlanSkeleton";
import WeeklyPlanContent from "@/components/weekly-plan/WeeklyPlanContent";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { WorkoutWeeklyPlan } from "@/types/workout/response/workout.types";

export default function WeeklyPlanScreen() {
  const { data, isLoading, isError, refetch } = useGetQuery<WorkoutWeeklyPlan>(
    workoutQueryKeys.weeklyPlan,
    workoutApi.getWeeklyPlan(),
  );

  if (isLoading) {
    return <WeeklyPlanSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        icon="weekly-plan"
        title="Couldn't load weekly plan"
        message="We couldn't load your weekly plan. Check your connection and try again."
        primaryAction={{
          onPress: refetch,
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="weekly-plan"
        title="Weekly plan unavailable"
        message="Your weekly workout plan is not available right now."
      />
    );
  }

  return <WeeklyPlanContent data={data} />;
}
