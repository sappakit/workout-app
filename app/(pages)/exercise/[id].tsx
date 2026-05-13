import { exerciseApi } from "@/app/api/exercise.api";
import ExerciseContent from "@/components/exercise/ExerciseContent";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseId = Number(id);
  const url = exerciseApi.getById(id);

  const { data, isLoading, isError, isSuccess } = useGetQuery<Exercise>(
    exerciseQueryKeys.detail(exerciseId),
    url,
  );

  // TODO: add loading/error
  if (isLoading) return null;
  if (isError || !data) return null;

  // if (isLoading) return <WorkoutSkeleton />;

  // if (isError || !data)
  //   return (
  //     <ErrorState
  //       title="Failed to Load Workout"
  //       message="We couldn't load today's workout."
  //       onRetry={refetch}
  //     />
  //   );

  return <ExerciseContent data={data} />;
}
