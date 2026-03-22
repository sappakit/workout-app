import { WorkoutContent } from "@/components/workout/WorkoutContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutSchedule } from "@/types/workout/response/workout.types";
import { workoutApi } from "../api/workout.api";

export default function WorkoutScreen() {
  const url = workoutApi.getSchedule();

  const { data, isLoading, isError, isSuccess } = useGetQuery<WorkoutSchedule>(
    workoutQueryKeys.schedule,
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

  return <WorkoutContent data={data} />;
}
