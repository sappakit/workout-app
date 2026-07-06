import { workoutApi } from "@/app/api/workout.api";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WeeklyPlanSkeleton } from "@/components/weekly-plan/ui/WeeklyPlanSkeleton";
import WeeklyPlanContent from "@/components/weekly-plan/WeeklyPlanContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutWeeklyPlan } from "@/types/workout/response/workout.types";

export default function WeeklyPlanScreen() {
  const { data, isLoading, isError, refetch } = useGetQuery<WorkoutWeeklyPlan>(
    workoutQueryKeys.weeklyPlan,
    workoutApi.getWeeklyPlan(),
  );

  if (isLoading) return <WeeklyPlanSkeleton />;

  if (isError)
    return (
      <ErrorState
        primaryAction={{
          onPress: refetch,
        }}
      />
    );

  if (!data) return <EmptyState />;

  return <WeeklyPlanContent data={data} />;
}
