import { exerciseApi } from "@/app/api/exercise.api";
import ExerciseDetailContent from "@/components/exercise/ExerciseDetailContent";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const exerciseId = Number(id);
  const url = exerciseApi.getById(id);

  const { data, isLoading, isError } = useGetQuery<Exercise>(
    exerciseQueryKeys.detail(exerciseId),
    url,
  );

  // TODO: add loading/error state later
  if (isLoading) return null;
  if (isError || !data) return null;

  return <ExerciseDetailContent data={data} />;
}
