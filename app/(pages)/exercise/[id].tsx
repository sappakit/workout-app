import ExerciseDetailContent from "@/components/exercise/ExerciseDetailContent";
import { ExerciseDetailSkeleton } from "@/components/exercise/ui/ExerciseDetailSkeleton";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { exerciseApi } from "@/lib/api/exercise.api";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useGetQuery } from "@/lib/query/useGetQuery";
import type { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const exerciseId = Number(id);
  const url = exerciseApi.getById(id);

  const { data, isLoading, isError, refetch } = useGetQuery<Exercise>(
    exerciseQueryKeys.detail(exerciseId),
    url,
  );

  if (isLoading) {
    return <ExerciseDetailSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        icon="exercise"
        title="Couldn't load exercise"
        message="We couldn't load this exercise. Check your connection and try again."
        primaryAction={{
          onPress: refetch,
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="exercise"
        title="Exercise unavailable"
        message="This exercise couldn't be found or is no longer available."
      />
    );
  }

  return <ExerciseDetailContent data={data} />;
}
