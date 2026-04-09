import { WorkoutInProgressContent } from "@/components/workout-in-progress/WorkoutInProgressContent";
import { WorkoutContent } from "@/components/workout/WorkoutContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutCurrent,
  WorkoutCurrentMode,
} from "@/types/workout/response/workout.types";
import { workoutApi } from "../api/workout.api";

export default function WorkoutScreen() {
  const url = workoutApi.getCurrent();

  const { data, isLoading, isError } = useGetQuery<WorkoutCurrent>(
    workoutQueryKeys.current,
    url,
    {
      staleTime: 0,
    },
  );

  console.log("data:", data);

  // TODO: add loading/error
  if (isLoading) return null;
  if (isError || !data) return null;

  switch (data.mode) {
    // In-progress session
    case WorkoutCurrentMode.IN_PROGRESS:
      return data.session ? (
        <WorkoutInProgressContent session={data.session} />
      ) : null;

    // Scheduled workout
    case WorkoutCurrentMode.SCHEDULED:
      return data.schedule ? <WorkoutContent data={data.schedule} /> : null;

    // TODO: add scrren for Rest day
    // Rest day
    case WorkoutCurrentMode.REST_DAY:
    default:
      return null;
  }
}
