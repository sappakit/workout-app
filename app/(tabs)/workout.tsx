import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { WorkoutInProgressContent } from "@/components/workout-in-progress/WorkoutInProgressContent";
import { mapWorkoutsToPreviewItems } from "@/components/workout/model/workout-preview.mapper";
import { WorkoutSkeleton } from "@/components/workout/ui/WorkoutSkeleton";
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
import { useRouter } from "expo-router";
import { useState } from "react";
import { workoutApi } from "../api/workout.api";

export default function WorkoutScreen() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>([]);

  const {
    data: currentWorkoutData,
    isLoading: isCurrentWorkoutLoading,
    isError: isCurrentWorkoutError,
    refetch: refetchCurrentWorkout,
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
    refetch: refetchWorkoutPreview,
  } = useInfiniteOptionsQuery<WorkoutResponse>({
    url: workoutApi.getAll(),
    queryKey: workoutQueryKeys.all,
    limit: 4,
    params: {
      muscleIds: selectedMuscleIds.length > 0 ? selectedMuscleIds : undefined,
      createdByMe: true,
    },
    enabled: shouldFetchWorkoutPreviews,
  });

  const handleRefresh = async () => {
    setIsPullRefreshing(true);

    try {
      await invalidateQueries([workoutQueryKeys.current, workoutQueryKeys.all]);
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handleRetry = async () => {
    await Promise.all([refetchCurrentWorkout(), refetchWorkoutPreview()]);
  };

  const workoutPreviews =
    workoutPreviewData?.pages.flatMap((page) => page.data) ?? [];

  const workoutPreviewItems = mapWorkoutsToPreviewItems(workoutPreviews, {
    onOpenWorkout: (workoutId) => {
      router.push({
        pathname: "/(pages)/workout/[id]",
        params: { id: workoutId },
      });
    },
    onFavoriteWorkout: (workoutId) => {
      console.log(`favorite workout: ${workoutId}`);
    },
  });

  if (isCurrentWorkoutLoading) return <WorkoutSkeleton />;

  if (isCurrentWorkoutError) return <ErrorState onRetry={handleRetry} />;

  if (!currentWorkoutData) return <EmptyState />;

  switch (currentWorkoutData.mode) {
    case WorkoutCurrentMode.IN_PROGRESS:
      return currentWorkoutData.session ? (
        <WorkoutInProgressContent
          session={currentWorkoutData.session}
          performanceByExerciseId={currentWorkoutData.performanceByExerciseId}
        />
      ) : (
        <EmptyState />
      );

    case WorkoutCurrentMode.SCHEDULED:
    case WorkoutCurrentMode.REST_DAY:
    case WorkoutCurrentMode.UNASSIGNED:
      return (
        <WorkoutContent
          mode={currentWorkoutData.mode}
          data={currentWorkoutData.schedule}
          hasCompletedWorkoutToday={currentWorkoutData.hasCompletedWorkoutToday}
          workoutPreviewSection={{
            items: workoutPreviewItems,
            selectedMuscleIds,
            onChangeMuscleIds: setSelectedMuscleIds,
            isLoading: isWorkoutPreviewLoading,
            isError: isWorkoutPreviewError,
            onRetry: refetchWorkoutPreview,
          }}
          pullToRefresh={{
            refreshing: isPullRefreshing,
            onRefresh: handleRefresh,
          }}
        />
      );

    default:
      return <EmptyState />;
  }
}
