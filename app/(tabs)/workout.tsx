import { WorkoutInProgressContent } from "@/components/workout-in-progress/WorkoutInProgressContent";
import { WorkoutContent } from "@/components/workout/WorkoutContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutCurrent,
  WorkoutCurrentMode,
} from "@/types/workout/response/workout.types";
import { workoutApi } from "../api/workout.api";

export default function WorkoutScreen() {
  const invalidateQueries = useInvalidateQueries();
  const url = workoutApi.getCurrent();

  const { data, isLoading, isError, isFetching } = useGetQuery<WorkoutCurrent>(
    workoutQueryKeys.current,
    url,
    {
      staleTime: 0,
    },
  );

  const handleRefresh = async () => {
    await invalidateQueries([workoutQueryKeys.current]);
  };

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
      return data.schedule ? (
        <WorkoutContent
          data={data.schedule}
          pullToRefresh={{ refreshing: isFetching, onRefresh: handleRefresh }}
        />
      ) : null;

    // TODO: add scrren for Rest day
    // Rest day
    case WorkoutCurrentMode.REST_DAY:
    default:
      return null;
  }
}
