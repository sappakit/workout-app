import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WorkoutDetailSkeleton } from "@/components/workout-detail/ui/WorkoutDetailSkeleton";
import WorkoutDetailContent from "@/components/workout-detail/WorkoutDetailContent";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams } from "expo-router";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const workoutId = Number(id);
  const url = workoutApi.getById(id);

  const { data, isLoading, isError, refetch } = useGetQuery<WorkoutResponse>(
    workoutQueryKeys.detail(workoutId),
    url,
  );

  if (isLoading) {
    return <WorkoutDetailSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        icon="workout"
        title="Couldn't load workout"
        message="We couldn't load this workout. Check your connection and try again."
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
        title="Workout unavailable"
        message="This workout couldn't be found or is no longer available."
      />
    );
  }

  return <WorkoutDetailContent data={data} />;
}
