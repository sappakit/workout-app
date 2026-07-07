import WorkoutDetailContent from "@/components/workout-detail/WorkoutDetailContent";
import { workoutApi } from "@/lib/api/workout.api";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams } from "expo-router";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const workoutId = Number(id);
  const url = workoutApi.getById(id);

  const { data, isLoading, isError } = useGetQuery<WorkoutResponse>(
    workoutQueryKeys.detail(workoutId),
    url,
  );

  // TODO: add loading/error state later
  if (isLoading) return null;
  if (isError || !data) return null;

  return <WorkoutDetailContent data={data} />;
}
