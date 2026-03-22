import { workoutApi } from "@/app/api/workout.api";
import EditPlanContent from "@/components/edit-plan/EditPlanContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams } from "expo-router";

export default function EditPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Number(id);
  const url = workoutApi.getById(id);

  const { data, isLoading, isError, isSuccess } = useGetQuery<WorkoutResponse>(
    workoutQueryKeys.detail(workoutId),
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

  return <EditPlanContent data={data} />;
}
