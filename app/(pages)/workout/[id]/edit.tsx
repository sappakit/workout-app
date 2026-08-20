import EditPlanContent from "@/components/edit-plan/EditPlanContent";
import { EditPlanSkeleton } from "@/components/edit-plan/ui/EditPlanSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams } from "expo-router";

export default function EditPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const workoutId = Number(id);
  const url = workoutApi.getById(id);

  const { data, isLoading, isError, refetch } = useGetQuery<WorkoutResponse>(
    workoutQueryKeys.detail(workoutId),
    url,
  );

  if (isLoading) {
    return <EditPlanSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        icon="workout"
        title="Couldn't load workout plan"
        message="We couldn't load this workout plan. Check your connection and try again."
        primaryAction={{
          onPress: refetch,
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="workout"
        title="Workout plan unavailable"
        message="This workout plan couldn't be found or is no longer available."
      />
    );
  }

  return <EditPlanContent data={data} />;
}
