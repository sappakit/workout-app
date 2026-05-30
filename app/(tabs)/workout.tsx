import { WorkoutInProgressContent } from "@/components/workout-in-progress/WorkoutInProgressContent";
import { mapWorkoutsToPreviewItems } from "@/components/workout/model/workout-preview.mapper";
import WorkoutContent from "@/components/workout/WorkoutContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  WorkoutCurrent,
  WorkoutCurrentMode,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { useState } from "react";
import { workoutApi } from "../api/workout.api";

export default function WorkoutScreen() {
  const invalidateQueries = useInvalidateQueries();

  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);

  const {
    data: currentWorkoutData,
    isLoading: isCurrentWorkoutLoading,
    isError: isCurrentWorkoutError,
    isFetching: isCurrentWorkoutFetching,
  } = useGetQuery<WorkoutCurrent>(
    workoutQueryKeys.current,
    workoutApi.getCurrent(),
    {
      staleTime: 0,
    },
  );

  const shouldFetchWorkoutPreviews =
    !!currentWorkoutData &&
    currentWorkoutData.mode !== WorkoutCurrentMode.IN_PROGRESS;

  const {
    data: workoutPreviewData,
    isLoading: isWorkoutPreviewLoading,
    isError: isWorkoutPreviewError,
    isFetching: isWorkoutPreviewFetching,
  } = useInfiniteOptionsQuery<WorkoutResponse>({
    url: workoutApi.getAll(),
    queryKey: workoutQueryKeys.all,
    limit: 4,
    params: {
      muscleIds: selectedMuscleIds.length > 0 ? selectedMuscleIds : undefined,
    },
    enabled: shouldFetchWorkoutPreviews,
  });

  const handleRefresh = async () => {
    await invalidateQueries([workoutQueryKeys.current, workoutQueryKeys.all]);
  };

  const workoutPreviews =
    workoutPreviewData?.pages.flatMap((page) => page.data) ?? [];
  const workoutPreviewItems = mapWorkoutsToPreviewItems(workoutPreviews);

  // TODO: add loading/error
  if (isCurrentWorkoutLoading) return null;
  if (isCurrentWorkoutError || !currentWorkoutData) return null;

  switch (currentWorkoutData.mode) {
    // In-progress session
    case WorkoutCurrentMode.IN_PROGRESS:
      return currentWorkoutData.session ? (
        <WorkoutInProgressContent session={currentWorkoutData.session} />
      ) : null;

    // Scheduled workout
    case WorkoutCurrentMode.SCHEDULED:
      // TODO: add loading/error
      if (isWorkoutPreviewLoading) return null;
      if (isWorkoutPreviewError) return null;

      return currentWorkoutData.schedule ? (
        <WorkoutContent
          data={currentWorkoutData.schedule}
          workoutPreviewItems={workoutPreviewItems}
          selectedMuscleIds={selectedMuscleIds}
          onChangeMuscleIds={setSelectedMuscleIds}
          pullToRefresh={{
            refreshing: isCurrentWorkoutFetching || isWorkoutPreviewFetching,
            onRefresh: handleRefresh,
          }}
        />
      ) : null;

    // TODO: add scrren for Rest day
    // Rest day
    case WorkoutCurrentMode.REST_DAY:
    default:
      return null;
  }
}
