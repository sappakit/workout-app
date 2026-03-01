import { WorkoutContent } from "@/components/workout/WorkoutContent";
import { useGetQuery } from "@/hooks/useGetQuery";
import { WorkoutSchedule } from "@/types/workout/workout.types";

export default function WorkoutScreen() {
  const { data, isLoading, isError, isSuccess } = useGetQuery<WorkoutSchedule>(
    ["workout-schedule"],
    "/workout/schedule",
  );

  if (isLoading) return null;

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
